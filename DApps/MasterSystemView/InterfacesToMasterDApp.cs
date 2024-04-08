using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.Reflection.PortableExecutable;
using static System.Net.WebRequestMethods;
using static MasterSystemView.SalesOrderContainer;

namespace MasterSystemView
{
    internal class InterfacesToMasterDApp
    {
        public static string HostUrl { get; set; } = "http://localhost:1337";

        private static readonly HttpClient client = new HttpClient();

        #region WorkStation
        static public async Task GetAllWorkStationAsync(WorkStationContainer container)
        {
            string url = HostUrl + "/GetAllWorkStation";
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    List<WorkStationDef> wslist = JsonConvert.DeserializeObject<List<WorkStationDef>>(data);
                    container.Update(wslist);
                }
                else
                {
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

        static public async Task PostWorkStationAsync(WorkStationContainer container, WorkStationDef newWorkStation)
        {
            string url = HostUrl + "/PostWorkStation";
            try
            {
                string json = JsonConvert.SerializeObject(newWorkStation);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Response: " + responseContent);

                    var wslist = container.Value;
                    wslist.Add(newWorkStation);                  
                    container.Update(wslist);
                }
                else
                {
                    Console.WriteLine("Failed to send  data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

        static public async Task UpdateWorkStationAsync(WorkStationContainer container, int selectedIndex, WorkStationDef updateInfo)
        {
            string url = HostUrl + "/UpdateWorkStation";
            try
            {
                string json = JsonConvert.SerializeObject(updateInfo);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PutAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Response: " + responseContent);
                    container.Value[selectedIndex] = updateInfo;
                }
                else
                {
                    Console.WriteLine("Failed to send  data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
        #endregion

        //==================================================================
        #region work plan
        static public async Task GetAllWorkPlanAsync(WorkPlanContainer container)
        {
            string url = HostUrl + "/GetAllWP";
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var wpList = JsonConvert.DeserializeObject<List<WorkPlanDef>>(data);
                    container.Update(wpList);
                }
                else
                {
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

        static public async Task UpdateWorkPlanAsync(WorkPlanDef updateInfo)
        {
            string url = HostUrl + "/UpdateWP";
            try
            {
                string json = JsonConvert.SerializeObject(updateInfo);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PutAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Response: " + responseContent);
                }
                else
                {
                    Console.WriteLine("Failed to send  data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
        #endregion
        //==================================================================



        //==================================================================
        #region sales order
        static public async Task GetAllSalesOrderAsync(SalesOrderContainer container)
        {
            string url = HostUrl + "/GetAllSO";
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var solist = JsonConvert.DeserializeObject<List<SalesOrderDef>>(data);

                    Dictionary<string, SalesOrderDef> newSODict = new Dictionary<string, SalesOrderDef>();
                    if (solist != null)
                    {
                        foreach (var so in solist)
                        {
                            newSODict[so.ID] = so;
                        }
                        container.Update(newSODict);
                    }
                }
                else
                {
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }


        static public async Task UpdateSalesOrderAsync(SalesOrderDef updateInfo)
        {
            string url = HostUrl + "/UpdateSO";
            try
            {
                string json = JsonConvert.SerializeObject(updateInfo);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PutAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Response: " + responseContent);
                }
                else
                {
                    Console.WriteLine("Failed to send  data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
        #endregion
        //==================================================================


        static public async Task GetAllDataFromProd(LedgerContainer container)
        {
            string url = HostUrl + "/GetAllObjectFromProd";
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    container.Json = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
        static public async Task GetAllDataFromMgmt(LedgerContainer container)
        {
            string url = HostUrl + "/GetAllObjectFromMgmt";
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    container.Json = await response.Content.ReadAsStringAsync();
                }
                else
                {
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
        static public async Task StartSO(string id)
        {
            string url = HostUrl + "/StartSO" + "?ID=" + id.ToString();
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
        static public async Task PendSO( string id)
        {
            string url = HostUrl + "/PendSO" + "?ID=" + id.ToString();
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
        static public async Task RestartSO(string id)
        {
            string url = HostUrl + "/RestartSO" + "?ID=" + id.ToString();
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    Console.WriteLine("Failed to retrieve data. Status code: " + response.StatusCode);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}
