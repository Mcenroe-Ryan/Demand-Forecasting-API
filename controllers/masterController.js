const { query } = require("../config/db"); // Adjust path if needed

const {
  // getAllCities,
  // getAllPlants,
  // getAllCategories,
  // getAllSkus,
  // getAllChannels,
  // getAllDemandForecasts,
  // getAllModels,
  // getAllForecastData,
  getAllState,
  getAllCategories,
  getAllChannels,
  getAllCities,
  getAllPlants,
  getAllSkus,
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
  getPlantsByCity,
  getCategoriesByPlant,
  getSkusByCategory,
  getForecastData,
  getForecastDataForTest,
  updateConsensusForecast,
  getAllModels,
  getAllEvents,
  getAllAlertsAndErrors,
  getAllDashboardProjects,
  cloneProject,
  alertCountService,
  updateAlertsStrikethroughService,
  getDemandForecastFullScreen,
  //compare model
  getDsModels,
  getDsModelsFeatures,
  getDsModelMetrics,
  getFvaVsStats,
  // work items
  getWorkItems,
  getWorkItemById,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem
} = require("../service/masterService");

const getAllStateData = async (req, res) => {
  try {
    const result = await getAllState();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCitiesData = async (req, res) => {
  try {
    const result = await getAllCities();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCategoriesData = async (req, res) => {
  try {
    const result = await getAllCategories();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllSkusData = async (req, res) => {
  try {
    const result = await getAllSkus();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllChannelsData = async (req, res) => {
  try {
    const result = await getAllChannels();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllPlantsData = async (req, res) => {
  try {
    const result = await getAllPlants();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllCountriesData = async (req, res) => {
  try {
    const result = await getAllCountries();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllModelsData = async (req, res) => {
  try {
    const result = await getAllModels();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllEventsData = async (req, res) => {
  try {
    const result = await getAllEvents();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAlertsAndErrorsData = async (req, res) => {
  try {
    const result = await getAllAlertsAndErrors();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllDashboardProjectsData = async (req, res) => {
  try {
    const result = await getAllDashboardProjects();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const cloneProjectController = async (req, res) => {
  const { id } = req.params;
  const body = req.body || {};
  const {
    project_name,
    project_code,
    project_description,
    project_type,
    project_status,
    start_date,
    end_date,
    created_by,
    updated_by,
    created_by_user_id,
    updated_by_user_id,
  } = body;

  if (!project_name || !project_code) {
    return res.status(400).json({
      error: "`project_name` and `project_code` are required to clone a project.",
    });
  }

  try {
    const result = await cloneProject(id, {
      project_name,
      project_code,
      project_description,
      project_type,
      project_status,
      start_date,
      end_date,
      created_by,
      updated_by,
      created_by_user_id,
      updated_by_user_id,
    });

    if (!result) {
      return res.status(404).json({ error: "Source project not found." });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /states?country_id=1
const fetchStates = async (req, res) => {
  try {
    const { country_id } = req.query;
    const states = await getStatesByCountry(country_id);
    res.json(states);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching states");
  }
};
// GET /cities?state_id=1
const fetchCities = async (req, res) => {
  try {
    const { state_id } = req.query;
    const cities = await getCitiesByState(state_id);
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching cities");
  }
};

// GET /plants?city_id=1
const fetchPlants = async (req, res) => {
  try {
    const { city_id } = req.query;
    const plants = await getPlantsByCity(city_id);
    res.json(plants);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching plants");
  }
};

// GET /categories?plant_id=1
const fetchCategories = async (req, res) => {
  try {
    const { plant_id } = req.query;
    const categories = await getCategoriesByPlant(plant_id);
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching categories");
  }
};

// GET /skus?category_id=1
const fetchSkus = async (req, res) => {
  try {
    const { category_id } = req.query;
    const skus = await getSkusByCategory(category_id);
    res.json(skus);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching SKUs");
  }
};

// GET /forecast?country_name=India&state_name=...&start_date=...&end_date=...
const fetchForecastData = async (req, res) => {
  try {
    const filters = req.query;
    const data = await getForecastData(filters);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching forecast data");
  }
};
const getForecastDataController = async (req, res) => {
  try {
    const data = await getForecastDataForTest();
    res.json(data);
  } catch (err) {
    console.error("Forecast fetch error:", err);
    res.status(500).json({ message: "Failed to fetch Forecast" });
  }
};

// In your backend controller (masterController.js)
const getPlantsByCities = async (city_ids) => {
  const result = await query(
    "SELECT * FROM dim_plant WHERE city_id = ANY($1)",
    [city_ids]
  );
  return result.rows;
};

const getDsModelData = async (req, res) => {
  try {
    const result = await getDsModels();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDsModelsFeaturesData = async (req, res) => {
  try {
    const result = await getDsModelsFeatures();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDsModelMetricsData = async (req, res) => {
  try {
    const result = await getDsModelMetrics();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFvaVsStatsData = async (req, res) => {
  try {
    const result = await getFvaVsStats();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAlertCountData = async (req, res) => {
  try {
    const result = await alertCountService();
    res.json(result);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAlertsStrikethroughController = async (req, res) => {
  const { id } = req.params;
  const { in_checked } = req.body;

  if (typeof in_checked !== "boolean") {
    return res.status(400).json({ error: "`in_checked` must be a boolean." });
  }

  try {
    const updatedRow = await updateAlertsStrikethroughService(id, in_checked);

    if (!updatedRow) {
      return res.status(404).json({ error: "Record not found." });
    }

    res.json({ success: true, updated: updatedRow });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getDemandForecastFullScreenController = async (req, res) => {
  try {
    const {
      country_name,
      state_name,
      city_name,
      plant_name,
      category_name
    } = req.body;

    if (!country_name || !state_name || !city_name || !plant_name || !category_name) {
      return res.status(400).json({ error: 'All location and category fields are required.' });
    }

    const data = await getDemandForecastFullScreen({
      country_name,
      state_name,
      city_name,
      plant_name,
      category_name
    });

    return res.json(data);
  } catch (err) {
    console.error('Demand forecastvFull Screen fetch error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getWorkItemsController = async (req, res) => {
  try {
    const filters = req.query || {};
    const data = await getWorkItems(filters);
    res.json(data);
  } catch (err) {
    console.error("Work items fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWorkItemByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getWorkItemById(id);
    if (!item) {
      return res.status(404).json({ error: "Work item not found." });
    }
    res.json(item);
  } catch (err) {
    console.error("Work item fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createWorkItemController = async (req, res) => {
  try {
    const payload = req.body || {};
    if (payload.project_id == null || !payload.work_item_title) {
      return res.status(400).json({
        error: "`project_id` and `work_item_title` are required.",
      });
    }

    const created = await createWorkItem(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("Work item create error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateWorkItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const updated = await updateWorkItem(id, payload);
    if (!updated) {
      return res.status(404).json({ error: "Work item not found or no updates." });
    }
    if (updated.p_status_out && updated.p_status_out.toLowerCase() !== "success") {
      return res.status(400).json(updated);
    }
    res.json(updated);
  } catch (err) {
    console.error("Work item update error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteWorkItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleted_by_user_id } = req.body || {};
    const deleted = await deleteWorkItem(id, deleted_by_user_id);
    if (!deleted) {
      return res.status(404).json({ error: "Work item not found." });
    }
    if (deleted.p_status && deleted.p_status.toLowerCase() !== "success") {
      return res.status(400).json(deleted);
    }
    res.json({ success: true, result: deleted });
  } catch (err) {
    console.error("Work item delete error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllCountriesData,
  getAllStateData,
  getAllCitiesData,
  getAllCategoriesData,
  getAllChannelsData,
  getAllSkusData,
  getAllPlantsData,
  fetchStates,
  fetchCities,
  fetchPlants,
  fetchCategories,
  fetchSkus,
  fetchForecastData,
  getForecastDataController,
  getPlantsByCities,
  getAllModelsData,
  getAllEventsData,
  getAllAlertsAndErrorsData,
  getAllDashboardProjectsData,
  cloneProjectController,
  getAlertCountData,
  updateAlertsStrikethroughController,
  getDemandForecastFullScreenController,
  //Compare models
  getDsModelData,
  getDsModelsFeaturesData,
  getDsModelMetricsData,
  getFvaVsStatsData,
  // work items
  getWorkItemsController,
  getWorkItemByIdController,
  createWorkItemController,
  updateWorkItemController,
  deleteWorkItemController
};
