using System;
using System.Drawing;
using System.Windows.Forms;
using System.Xml.Linq;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System.Reflection.PortableExecutable;
using System.Net.Http;
using static System.Net.WebRequestMethods;
using MasterSystemView.Dialogs;
using static MasterSystemView.SalesOrderContainer;

namespace MasterSystemView
{
    public partial class Form1 : Form
    {
        #region data members
        internal WorkStationContainer WorkStationContainer { get; set; } = new WorkStationContainer();

        internal WorkPlanContainer WorkPlanContainer { get; set; } = new WorkPlanContainer();
        internal string selectedWPId { get; set; } = string.Empty;

        internal SalesOrderContainer SalesOrderContainer { get; set; } = new SalesOrderContainer();
        internal string selectedSOId { get; set; } = string.Empty;

        internal LedgerContainer MgmtLedgerContainer { get; set; } = new LedgerContainer();
        internal LedgerContainer ProdLedgerContainer { get; set; } = new LedgerContainer();
        #endregion

        public Form1()
        {
            InitializeComponent();
            InterfacesToMasterDApp.HostUrl = "http://localhost:1337";
        }



        #region Data Visualization

        private void MainForm_Load(object sender, EventArgs e)
        {
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.GetAllWorkStationAsync(this.WorkStationContainer);
                await InterfacesToMasterDApp.GetAllWorkPlanAsync(this.WorkPlanContainer);
            });
            timer1.Start();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            timer1.Stop();
            if (WorkStationContainer.IsUpdated)
            {
                WorkStationContainer.IsUpdated = false;
                dataGridViewWorkStation.DataSource = new BindingSource() { DataSource = WorkStationContainer.Value };
                dataGridViewWorkStation.Refresh();
            }

            if (WorkPlanContainer.IsUpdated)
            {
                WorkPlanContainer.IsUpdated = false;
                if (selectedWPId == string.Empty)
                {
                    selectedWPId = WorkPlanContainer.Dict.Keys.First();
                }
                listBox_WorkPlan.Items.Clear();
                var ids = WorkPlanContainer.Dict.Keys.ToArray();

                listBox_WorkPlan.Items.AddRange(ids);
                //listBox_WorkPlan.SelectedItem = selectedWorkPlanId;

                dataGridView_WorkPlan.DataSource = new BindingSource() { DataSource = WorkPlanContainer[selectedWPId].TransitionList.Values };
                dataGridView_WorkPlan.Refresh();
            }

            if (SalesOrderContainer.IsUpdated)
            {
                SalesOrderContainer.IsUpdated = false;
                if (selectedSOId == string.Empty)
                {
                    selectedSOId = SalesOrderContainer.Dict.Keys.First();
                }
                txtSelectedSoId.Text = selectedSOId;
                listBox_SO.Items.Clear();
                var ids = SalesOrderContainer.Dict.Keys.ToArray();

                listBox_SO.Items.AddRange(ids);
                //listBox_WorkPlan.SelectedItem = selectedWorkPlanId;

                dataGridView_SalesOrder.DataSource = new BindingSource() { DataSource = SalesOrderContainer[selectedSOId].SalesTerms.Values };
                dataGridView_SalesOrder.Refresh();
            }

            if (MgmtLedgerContainer.IsUpdated)
            {
                MgmtLedgerContainer.IsUpdated = false;
                string jsonString = MgmtLedgerContainer.Json;
                // 使用JToken.Parse方法將字符串解析為JSON數據結構
                JToken jsonToken = JToken.Parse(jsonString);

                // 使用JsonConvert.SerializeObject方法來美化JSON內容
                string beautifiedJsonString = JsonConvert.SerializeObject(jsonToken, Formatting.Indented);
                rtxt_Mgmtledger.Text = beautifiedJsonString;
            }
            if (ProdLedgerContainer.IsUpdated)
            {
                ProdLedgerContainer.IsUpdated = false;
                string jsonString = ProdLedgerContainer.Json;
                // 使用JToken.Parse方法將字符串解析為JSON數據結構
                JToken jsonToken = JToken.Parse(jsonString);

                // 使用JsonConvert.SerializeObject方法來美化JSON內容
                string beautifiedJsonString = JsonConvert.SerializeObject(jsonToken, Formatting.Indented);
                rtxt_ProdLedger.Text = beautifiedJsonString;
            }
            timer1.Start();
        }

        #endregion

        //==================================================================
        #region work station tab

        private void button_WorkStationAdd_Click(object sender, EventArgs e)
        {
            WorkstationDialog workstationForm = new WorkstationDialog(Operation.Add);
            if (workstationForm.ShowDialog() == DialogResult.OK)
            {
                // 從WorkstationForm獲取輸入的資訊
                var newWorkStation = workstationForm.Content;

                Task.Run(async () =>
                {
                    await InterfacesToMasterDApp.PostWorkStationAsync(this.WorkStationContainer, newWorkStation);
                    await InterfacesToMasterDApp.GetAllWorkStationAsync(this.WorkStationContainer);
                });
            }
        }

        private void button_WorkStationModify_Click(object sender, EventArgs e)
        {
            //load information from 將資訊添加到DataGridView
            if (dataGridViewWorkStation.SelectedRows.Count == 0)
            {
                MessageBox.Show("Please select a row");
            }

            var selectedRow = dataGridViewWorkStation.SelectedRows;
            int selectedIndex = selectedRow[0].Index;

            var wslist = WorkStationContainer.Value;
            WorkStationDef content = wslist[selectedIndex];
            WorkstationDialog workstationdlg = new WorkstationDialog(Operation.Modify);
            workstationdlg.Content = content;

            if (workstationdlg.ShowDialog() == DialogResult.OK)
            {
                // 從WorkstationForm獲取輸入的資訊
                var updateInfo = workstationdlg.Content;
                Task.Run(async () =>
                {
                    await InterfacesToMasterDApp.UpdateWorkStationAsync(this.WorkStationContainer, selectedIndex, updateInfo);
                    await InterfacesToMasterDApp.GetAllWorkStationAsync(this.WorkStationContainer);
                });
            }
        }

        private void button_WorkStationSync_Click(object sender, EventArgs e)
        {
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.GetAllWorkStationAsync(this.WorkStationContainer);
            });
        }

        #endregion //work station tab
        //==================================================================


        //==================================================================
        #region work plan
        private void button_WorkPlanSync_Click(object sender, EventArgs e)
        {
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.GetAllWorkPlanAsync(this.WorkPlanContainer);
            });
        }

        private void button_WorkPlanAdd_Click(object sender, EventArgs e)
        {
            var id_list = WorkPlanContainer.Dict.Keys.ToList();

            ID_Check_Diglog dlg = new ID_Check_Diglog(id_list);

            if (dlg.ShowDialog() == DialogResult.OK)
            {
                // 從WorkstationForm獲取輸入的資訊
                string assignedId = dlg.AssignedID;
                listBox_WorkPlan.Items.Add(assignedId);

                var workplan_new = new WorkPlanDef();
                workplan_new.ID = assignedId;

                var wplist = WorkPlanContainer.Dict;
                wplist[workplan_new.ID] = workplan_new;
                WorkPlanContainer.Update(wplist.Values.ToList());

                selectedWPId = assignedId;
            }
        }

        private void listBox_WorkPlan_SelectedValueChanged(object sender, EventArgs e)
        {
            if (listBox_WorkPlan.SelectedItems.Count == 0)
                return;

            this.selectedWPId = listBox_WorkPlan.SelectedItems[0].ToString();
            var transitionDict = WorkPlanContainer[this.selectedWPId].TransitionList;
            if (transitionDict == null || transitionDict.Count == 0)
            {
                transitionDict["0"] = new TransitionDef();
            }

            this.WorkPlanContainer.IsUpdated = true;
        }

        private void button_TransitionAdd_Click(object sender, EventArgs e)
        {
            TransitionConfigDialog dlg = new TransitionConfigDialog();
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                var transition = dlg.Transition;
                WorkPlanContainer[this.selectedWPId].TransitionList[transition.ID] = transition;
                WorkPlanContainer.IsUpdated = true;
            }
        }

        private void button_TransitionModify_Click(object sender, EventArgs e)
        {
            DataGridViewRow selectedRow = dataGridView_WorkPlan.SelectedRows[0];
            if (selectedRow != null)
            {
                MessageBox.Show("Please add a tranisition firstly");
                return;
            }
            string idValue = selectedRow.Cells["ID"].Value.ToString();
            TransitionConfigDialog dlg = new TransitionConfigDialog();
            dlg.Transition = WorkPlanContainer[this.selectedWPId].TransitionList[idValue];
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                var transition = dlg.Transition;
                WorkPlanContainer[this.selectedWPId].TransitionList[transition.ID] = transition;
                WorkPlanContainer.IsUpdated = true;
            }
        }

        private void button_TransitionDelete_Click(object sender, EventArgs e)
        {
            if (dataGridView_WorkPlan.SelectedRows.Count > 0)
            {
                DataGridViewRow selectedRow = dataGridView_WorkPlan.SelectedRows[0];
                string idValue = selectedRow.Cells["ID"].Value.ToString();
                WorkPlanContainer[this.selectedWPId].TransitionList.Remove(idValue);
                WorkPlanContainer.IsUpdated = true;
            }
            else
            {
                MessageBox.Show("Please select a row.");
            }
        }

        private void button_CommitWP_Click(object sender, EventArgs e)
        {
            if (dataGridView_WorkPlan.SelectedRows.Count > 0)
            {
                var selectedwp = WorkPlanContainer[this.selectedWPId];
                Task.Run(async () =>
                {
                    await InterfacesToMasterDApp.UpdateWorkPlanAsync(selectedwp);
                });
            }
            else
            {
                MessageBox.Show("Please select a row.");
            }
        }
        #endregion
        //==================================================================


        //==================================================================
        #region sales order
        private void btnSyncSOFromMES_Click(object sender, EventArgs e)
        {
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.GetAllSalesOrderAsync(this.SalesOrderContainer);
            });
        }

        private void btn_AddSO_Click(object sender, EventArgs e)
        {
            var soDict = this.SalesOrderContainer.Dict;
            var id_strings = soDict.Keys.ToArray();
            int max_id = id_strings.Select(int.Parse).Max();

            SalesOrderDef newSO = new SalesOrderDef() { ID = (max_id + 1).ToString() };
            soDict.Add(newSO.ID, newSO);
            this.SalesOrderContainer.Update(soDict);
        }

        private void btnAddTerm_Click(object sender, EventArgs e)
        {
            SalesTermConfigDialog dlg = new SalesTermConfigDialog(this.WorkPlanContainer);
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                var selectedSO = this.SalesOrderContainer[this.selectedSOId];
                var result = dlg.Result;
                var id_strings = selectedSO.SalesTerms.Keys.ToArray();

                int idx = id_strings.Select(int.Parse).Max();

                for (int i = 0; i < result.Quantity; i++)
                {
                    idx = idx + 1;
                    var st = new SalesTermDef()
                    {
                        ID = idx.ToString(),
                        ProductName = result.ProductName,
                        RefWorkPlan = result.ReferedWorkPlan
                    };
                    selectedSO.SalesTerms[st.ID] = st;
                }
                this.SalesOrderContainer.IsUpdated = true;
            }
        }

        private void btnModifyTerm_Click(object sender, EventArgs e)
        {
            //know selected SO and term
            var selectedSO = this.SalesOrderContainer[this.selectedSOId];

            DataGridViewRow selectedRow = dataGridView_SalesOrder.SelectedRows[0];
            string idValue = selectedRow.Cells["ID"].Value.ToString();
            var selectedTerm = this.SalesOrderContainer[this.selectedSOId].SalesTerms[idValue];

            //prepare dialog
            SalesTermConfigDialog dlg = new SalesTermConfigDialog(this.WorkPlanContainer);
            dlg.Result = new SalesTermConfigDialogResult()
            {
                ProductName = selectedTerm.ProductName,
                ReferedWorkPlan = selectedTerm.RefWorkPlan
            };

            if (dlg.ShowDialog() == DialogResult.OK)
            {
                var st = new SalesTermDef()
                {
                    ID = idValue,
                    ProductName = dlg.Result.ProductName,
                    RefWorkPlan = dlg.Result.ReferedWorkPlan
                };
                selectedSO.SalesTerms[st.ID] = st;
                SalesOrderContainer.IsUpdated = true;
            }
        }

        private void btnPostSalesOrderToMES_Click(object sender, EventArgs e)
        {
            if (dataGridView_SalesOrder.SelectedRows.Count > 0)
            {
                var selectedso = SalesOrderContainer[this.selectedSOId];

                Task.Run(async () =>
                {
                    await InterfacesToMasterDApp.UpdateSalesOrderAsync(selectedso);
                });
            }
            else
            {
                MessageBox.Show("Please select a row.");
            }
        }

        private void listBox_SO_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (listBox_SO.SelectedItems.Count == 0)
                return;

            this.selectedSOId = listBox_SO.SelectedItems[0].ToString();
            var term = SalesOrderContainer[this.selectedSOId].SalesTerms;


            if (term == null || term.Count == 0)
            {
                term["1"] = new SalesTermDef() { ID = "1" };
            }

            this.SalesOrderContainer.IsUpdated = true;
        }

        private void btnReadLedger_Click(object sender, EventArgs e)
        {
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.GetAllDataFromMgmt(this.MgmtLedgerContainer);
            });
        }

        private void btnReadLedgerFromProd_Click(object sender, EventArgs e)
        {
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.GetAllDataFromProd(this.ProdLedgerContainer);
            });
        }

        private void btnStartSO_Click(object sender, EventArgs e)
        {
            var selectedso = SalesOrderContainer[this.selectedSOId];
            string so_id = selectedso.ID;
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.StartSO(so_id);
            });
        }

        private void btnPendSO_Click(object sender, EventArgs e)
        {
            var selectedso = SalesOrderContainer[this.selectedSOId];
            string so_id = selectedso.ID;
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.PendSO(so_id);
            });
        }

        private void btnECO_Click(object sender, EventArgs e)
        {
            var so_id = this.selectedSOId;
            var selectedSalesOrder = SalesOrderContainer[this.selectedSOId];
            var salesTerms = selectedSalesOrder.SalesTerms;
            foreach (var st in salesTerms)
            {
                var st_id = st.Value.ID;
                var wp_id = st.Value.RefWorkPlan;
                Task.Run(async () =>
                {
                    await InterfacesToMasterDApp.ApplyEngineeringChangeOrderAsync(so_id,st_id,wp_id);
                });
            }
        }

        private void btnRestart_Click(object sender, EventArgs e)
        {
            var selectedso = SalesOrderContainer[this.selectedSOId];
            string so_id = selectedso.ID;
            Task.Run(async () =>
            {
                await InterfacesToMasterDApp.RestartSO(so_id);
            });
        }


        #endregion
        //==================================================================





    }
}