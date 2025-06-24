const animalCase = require('../../Model/animalCaseModel');
const asyncHandler = require('express-async-handler');

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const yesterdayStart = new Date(startOfDay);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(endOfDay);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

  const getResponseEfficiency = async () => {
    const resolvedCases = await animalCase.find({ status: "Resolved" }, {
      createdAt: 1,
      updatedAt: 1,
      governorate: 1
    });

    const resolutionTimes = resolvedCases.map(c => new Date(c.updatedAt) - new Date(c.createdAt));

    const avgResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((sum, t) => sum + t, 0) / resolutionTimes.length / (60 * 60 * 1000)
      : 0;

    const within48hCount = resolutionTimes.filter(t => t <= 48 * 60 * 60 * 1000).length;
    const resolutionRate = resolutionTimes.length > 0 ? (within48hCount / resolutionTimes.length * 100) : 0;

    const delayedRegions = [...new Set(resolvedCases
      .filter(c => (new Date(c.updatedAt) - new Date(c.createdAt)) > 48 * 60 * 60 * 1000)
      .map(c => c.governorate))];

    return {
      avgResolutionTime: avgResolutionTime.toFixed(2),
      resolutionRate: resolutionRate.toFixed(2),
      delayedRegions
    };
  };

  const [
    todayCount,
    yesterdayCount,
    unknownCount,
    topGovernorates,
    topDiseases,
    allReports,
    mapPoints,
    responseEfficiency
  ] = await Promise.all([
    animalCase.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
    animalCase.countDocuments({ createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } }),
    animalCase.countDocuments({ "originDetermination.notDetermined.0": { $exists: true } }),

    animalCase.aggregate([
      {
        $project: {
          governorate: 1,
          allDiseases: {
            $concatArrays: [
              "$originDetermination.insectRelatedIssues",
              "$originDetermination.bacterialIssues",
              "$originDetermination.viralIssues",
              "$originDetermination.infectionsAndParasites",
              "$originDetermination.newIssues",
              "$originDetermination.respiratoryIssues",
              "$originDetermination.traumasAndInheritance",
              "$originDetermination.notDetermined"
            ]
          }
        }
      },
      { $unwind: "$allDiseases" },
      {
        $group: {
          _id: {
            governorate: "$governorate",
            disease: "$allDiseases"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.governorate",
          diseases: {
            $push: {
              disease: "$_id.disease",
              count: "$count"
            }
          },
          totalCases: { $sum: "$count" }
        }
      },
      { $sort: { totalCases: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          governorate: "$_id",
          topDiseases: {
            $slice: [
              { $sortArray: { input: "$diseases", sortBy: { count: -1 } } },
              3
            ]
          }
        }
      }
    ]),

    animalCase.aggregate([
      {
        $project: {
          diseaseCategories: {
            insect: { $size: { $ifNull: ["$originDetermination.insectRelatedIssues", []] } },
            bacterial: { $size: { $ifNull: ["$originDetermination.bacterialIssues", []] } },
            viral: { $size: { $ifNull: ["$originDetermination.viralIssues", []] } }
          }
        }
      },
      {
        $project: {
          total: { $add: ["$diseaseCategories.insect", "$diseaseCategories.bacterial", "$diseaseCategories.viral"] },
          categories: {
            "Insect-Borne Diseases": "$diseaseCategories.insect",
            "Bacterial Diseases": "$diseaseCategories.bacterial",
            "Viral Diseases": "$diseaseCategories.viral"
          }
        }
      },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          disease: "$_id",
          count: 1
        }
      }
    ]),

   
    animalCase.find({}).sort({ createdAt: -1 }),

    animalCase.find({
      "contactInformation.caseLocation.coordinates": { $exists: true }
    }, {
      _id: 0,
      governorate: 1,
      animalType: 1,
      originDetermination: 1,
      "contactInformation.caseLocation": 1
    }),

    getResponseEfficiency()
  ]);

  const changePercent = yesterdayCount ? ((todayCount - yesterdayCount) / yesterdayCount * 100) : 0;


  const formattedReports = allReports.map(report => ({
    id: report._id,
    animalType: report.animalType,
    originDetermination: report.originDetermination,
    diagnosticQuestions: report.diagnosticQuestions,
    contactInformation: report.contactInformation,
    images: report.images,
    notes: report.notes,
    status: report.status,
    governorate: report.governorate,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt
  }));

  const formattedMapPoints = mapPoints.map(c => {
    const allDiseases = [
      ...(c.originDetermination.insectRelatedIssues || []),
      ...(c.originDetermination.bacterialIssues || []),
      ...(c.originDetermination.viralIssues || []),
      ...(c.originDetermination.infectionsAndParasites || []),
      ...(c.originDetermination.newIssues || []),
      ...(c.originDetermination.respiratoryIssues || []),
      ...(c.originDetermination.traumasAndInheritance || []),
      ...(c.originDetermination.notDetermined || [])
    ];
    return {
      lat: c.contactInformation.caseLocation.coordinates[1],
      lng: c.contactInformation.caseLocation.coordinates[0],
      governorate: c.governorate,
      animalType: c.animalType,
      disease: allDiseases.join(', ') || 'غير محدد'
    };
  });

  res.status(200).json({
    success: true,
    stats: {
      todayCount,
      yesterdayCount,
      changePercent: changePercent.toFixed(2),
      changeDetails: {
        today: todayCount,
        yesterday: yesterdayCount,
        percent: changePercent.toFixed(2)
      },
      unknownCount,
      topGovernorates,
      topDiseases,
      responseEfficiency,
      mapPoints: formattedMapPoints
    },
    reports: formattedReports 
  });
});
