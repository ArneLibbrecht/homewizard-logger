const axios = require('axios');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Load environment variables
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
const influxURL = process.env.INFLUX_URL;
const homewizardURL = process.env.HOMEWIZARD_URL;

const influxDB = new InfluxDB({ url: influxURL, token: token });
const writeApi = influxDB.getWriteApi(org, bucket, 'ns');


// Polling the API every 30 seconds
async function pollAPI() {
  try {
    const response = await axios.get(homewizardURL+"/api/v1/data");  
    
    const ikwh = response.data.total_power_import_kwh;
    const ekwh = response.data.total_power_export_kwh;
    const w1 = response.data.active_power_l1_w;
    const w2 = response.data.active_power_l2_w;
    const w3 = response.data.active_power_l3_w;
    const v1 = response.data.active_voltage_l1_v;
    const v2 = response.data.active_voltage_l2_v;
    const v3 = response.data.active_voltage_l3_v;
    const a1 = response.data.active_current_l1_a;
    const a2 = response.data.active_current_l2_a;
    const a3 = response.data.active_current_l3_a;


    
    


    const point = new Point('power_metrics')
    .tag('source', 'api')
    .floatField('ikwh', ikwh)
    .floatField('ekwh', ekwh)
    .floatField('w1', w1)
    .floatField('w2', w2)
    .floatField('w3', w3)
    .floatField('v1', v1)
    .floatField('v2', v2)
    .floatField('v3', v3)
    .floatField('a1', a1)
    .floatField('a2', a2)
    .floatField('a3', a3);


  // Write the point to InfluxDB
  writeApi.writePoint(point);
  writeApi.flush(); // Ensure data is sent right away



  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
}

setInterval(pollAPI, 30000); // Poll every 30 seconds
