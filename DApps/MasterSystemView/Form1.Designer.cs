namespace MasterSystemView
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            tabControl1 = new TabControl();
            tabPage_WS = new TabPage();
            dataGridViewWorkStation = new DataGridView();
            panel1 = new Panel();
            button_WorkStationSync = new Button();
            button_WorkStationModify = new Button();
            button_WorkStationAdd = new Button();
            tabPage_WP = new TabPage();
            panel5 = new Panel();
            dataGridView_WorkPlan = new DataGridView();
            panel6 = new Panel();
            button_TransitionAdd = new Button();
            button_TransitionModify = new Button();
            button_TransitionDelete = new Button();
            textBox1 = new TextBox();
            button_CommitWP = new Button();
            panel2 = new Panel();
            listBox_WorkPlan = new ListBox();
            panel4 = new Panel();
            button_WorkPlanDelete = new Button();
            button_WorkPlanSyncFromMES = new Button();
            button_WorkPlanAdd = new Button();
            listBox_WPList = new ListBox();
            tabPage_SO = new TabPage();
            panel7 = new Panel();
            dataGridView_SalesOrder = new DataGridView();
            panel8 = new Panel();
            txtSelectedSoId = new TextBox();
            btnAddTerm = new Button();
            btnDeleteTerm = new Button();
            btnModifyTerm = new Button();
            btnCloneTerm = new Button();
            textBox2 = new TextBox();
            btnPostSalesOrderToMES = new Button();
            panel3 = new Panel();
            listBox_SO = new ListBox();
            btnSyncSOFromMES = new Button();
            btnDeleteSO = new Button();
            btn_AddSO = new Button();
            tabPage_WO = new TabPage();
            tabPage_Ledger = new TabPage();
            rtxt_ledger = new RichTextBox();
            btnReadLedger = new Button();
            button_WPSync = new Button();
            timer1 = new System.Windows.Forms.Timer(components);
            tabControl1.SuspendLayout();
            tabPage_WS.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridViewWorkStation).BeginInit();
            panel1.SuspendLayout();
            tabPage_WP.SuspendLayout();
            panel5.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridView_WorkPlan).BeginInit();
            panel6.SuspendLayout();
            panel2.SuspendLayout();
            panel4.SuspendLayout();
            tabPage_SO.SuspendLayout();
            panel7.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)dataGridView_SalesOrder).BeginInit();
            panel8.SuspendLayout();
            panel3.SuspendLayout();
            tabPage_Ledger.SuspendLayout();
            SuspendLayout();
            // 
            // tabControl1
            // 
            tabControl1.Appearance = TabAppearance.FlatButtons;
            tabControl1.Controls.Add(tabPage_WS);
            tabControl1.Controls.Add(tabPage_WP);
            tabControl1.Controls.Add(tabPage_SO);
            tabControl1.Controls.Add(tabPage_WO);
            tabControl1.Controls.Add(tabPage_Ledger);
            tabControl1.Dock = DockStyle.Fill;
            tabControl1.Font = new Font("Consolas", 9.75F, FontStyle.Regular, GraphicsUnit.Point);
            tabControl1.ImeMode = ImeMode.Alpha;
            tabControl1.Location = new Point(0, 0);
            tabControl1.Margin = new Padding(6);
            tabControl1.Multiline = true;
            tabControl1.Name = "tabControl1";
            tabControl1.SelectedIndex = 0;
            tabControl1.Size = new Size(793, 499);
            tabControl1.SizeMode = TabSizeMode.FillToRight;
            tabControl1.TabIndex = 1;
            // 
            // tabPage_WS
            // 
            tabPage_WS.BackColor = Color.Beige;
            tabPage_WS.Controls.Add(dataGridViewWorkStation);
            tabPage_WS.Controls.Add(panel1);
            tabPage_WS.ForeColor = Color.Brown;
            tabPage_WS.Location = new Point(4, 27);
            tabPage_WS.Margin = new Padding(6);
            tabPage_WS.Name = "tabPage_WS";
            tabPage_WS.Padding = new Padding(6);
            tabPage_WS.Size = new Size(785, 468);
            tabPage_WS.TabIndex = 0;
            tabPage_WS.Text = "Work Station";
            // 
            // dataGridViewWorkStation
            // 
            dataGridViewWorkStation.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridViewWorkStation.Dock = DockStyle.Fill;
            dataGridViewWorkStation.Location = new Point(6, 64);
            dataGridViewWorkStation.MultiSelect = false;
            dataGridViewWorkStation.Name = "dataGridViewWorkStation";
            dataGridViewWorkStation.RowHeadersWidth = 82;
            dataGridViewWorkStation.RowTemplate.Height = 40;
            dataGridViewWorkStation.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridViewWorkStation.Size = new Size(773, 398);
            dataGridViewWorkStation.TabIndex = 3;
            // 
            // panel1
            // 
            panel1.Controls.Add(button_WorkStationSync);
            panel1.Controls.Add(button_WorkStationModify);
            panel1.Controls.Add(button_WorkStationAdd);
            panel1.Dock = DockStyle.Top;
            panel1.Location = new Point(6, 6);
            panel1.Name = "panel1";
            panel1.Size = new Size(773, 58);
            panel1.TabIndex = 2;
            // 
            // button_WorkStationSync
            // 
            button_WorkStationSync.Dock = DockStyle.Left;
            button_WorkStationSync.Location = new Point(392, 0);
            button_WorkStationSync.Name = "button_WorkStationSync";
            button_WorkStationSync.Size = new Size(171, 58);
            button_WorkStationSync.TabIndex = 3;
            button_WorkStationSync.Text = "Sync with SCS";
            button_WorkStationSync.UseVisualStyleBackColor = true;
            button_WorkStationSync.Click += button_WorkStationSync_Click;
            // 
            // button_WorkStationModify
            // 
            button_WorkStationModify.Dock = DockStyle.Left;
            button_WorkStationModify.Location = new Point(196, 0);
            button_WorkStationModify.Name = "button_WorkStationModify";
            button_WorkStationModify.Size = new Size(196, 58);
            button_WorkStationModify.TabIndex = 2;
            button_WorkStationModify.Text = "Modify";
            button_WorkStationModify.UseVisualStyleBackColor = true;
            button_WorkStationModify.Click += button_WorkStationModify_Click;
            // 
            // button_WorkStationAdd
            // 
            button_WorkStationAdd.Dock = DockStyle.Left;
            button_WorkStationAdd.Location = new Point(0, 0);
            button_WorkStationAdd.Name = "button_WorkStationAdd";
            button_WorkStationAdd.Size = new Size(196, 58);
            button_WorkStationAdd.TabIndex = 1;
            button_WorkStationAdd.Text = "Add";
            button_WorkStationAdd.UseVisualStyleBackColor = true;
            button_WorkStationAdd.Click += button_WorkStationAdd_Click;
            // 
            // tabPage_WP
            // 
            tabPage_WP.BackColor = Color.LightGray;
            tabPage_WP.Controls.Add(panel5);
            tabPage_WP.Controls.Add(panel2);
            tabPage_WP.ForeColor = SystemColors.Highlight;
            tabPage_WP.Location = new Point(4, 27);
            tabPage_WP.Margin = new Padding(6);
            tabPage_WP.Name = "tabPage_WP";
            tabPage_WP.Padding = new Padding(6);
            tabPage_WP.Size = new Size(785, 468);
            tabPage_WP.TabIndex = 1;
            tabPage_WP.Text = "Work Plan";
            // 
            // panel5
            // 
            panel5.Controls.Add(dataGridView_WorkPlan);
            panel5.Controls.Add(panel6);
            panel5.Dock = DockStyle.Fill;
            panel5.Location = new Point(119, 6);
            panel5.Name = "panel5";
            panel5.Size = new Size(660, 456);
            panel5.TabIndex = 3;
            // 
            // dataGridView_WorkPlan
            // 
            dataGridView_WorkPlan.AllowUserToResizeRows = false;
            dataGridView_WorkPlan.BackgroundColor = SystemColors.ActiveCaptionText;
            dataGridView_WorkPlan.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridView_WorkPlan.Dock = DockStyle.Fill;
            dataGridView_WorkPlan.Location = new Point(0, 38);
            dataGridView_WorkPlan.MultiSelect = false;
            dataGridView_WorkPlan.Name = "dataGridView_WorkPlan";
            dataGridView_WorkPlan.RowTemplate.Height = 25;
            dataGridView_WorkPlan.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridView_WorkPlan.Size = new Size(660, 418);
            dataGridView_WorkPlan.StandardTab = true;
            dataGridView_WorkPlan.TabIndex = 1;
            // 
            // panel6
            // 
            panel6.Controls.Add(button_TransitionAdd);
            panel6.Controls.Add(button_TransitionModify);
            panel6.Controls.Add(button_TransitionDelete);
            panel6.Controls.Add(textBox1);
            panel6.Controls.Add(button_CommitWP);
            panel6.Dock = DockStyle.Top;
            panel6.Location = new Point(0, 0);
            panel6.Name = "panel6";
            panel6.Size = new Size(660, 38);
            panel6.TabIndex = 2;
            // 
            // button_TransitionAdd
            // 
            button_TransitionAdd.Dock = DockStyle.Right;
            button_TransitionAdd.Location = new Point(278, 0);
            button_TransitionAdd.Name = "button_TransitionAdd";
            button_TransitionAdd.Size = new Size(62, 38);
            button_TransitionAdd.TabIndex = 1;
            button_TransitionAdd.Text = "Add";
            button_TransitionAdd.UseVisualStyleBackColor = true;
            button_TransitionAdd.Click += button_TransitionAdd_Click;
            // 
            // button_TransitionModify
            // 
            button_TransitionModify.Dock = DockStyle.Right;
            button_TransitionModify.Location = new Point(340, 0);
            button_TransitionModify.Name = "button_TransitionModify";
            button_TransitionModify.Size = new Size(75, 38);
            button_TransitionModify.TabIndex = 4;
            button_TransitionModify.Text = "Modify";
            button_TransitionModify.UseVisualStyleBackColor = true;
            button_TransitionModify.Click += button_TransitionModify_Click;
            // 
            // button_TransitionDelete
            // 
            button_TransitionDelete.Dock = DockStyle.Right;
            button_TransitionDelete.Location = new Point(415, 0);
            button_TransitionDelete.Name = "button_TransitionDelete";
            button_TransitionDelete.Size = new Size(69, 38);
            button_TransitionDelete.TabIndex = 3;
            button_TransitionDelete.Text = "Delete";
            button_TransitionDelete.UseVisualStyleBackColor = true;
            button_TransitionDelete.Click += button_TransitionDelete_Click;
            // 
            // textBox1
            // 
            textBox1.Dock = DockStyle.Left;
            textBox1.Location = new Point(0, 0);
            textBox1.Multiline = true;
            textBox1.Name = "textBox1";
            textBox1.ReadOnly = true;
            textBox1.Size = new Size(159, 38);
            textBox1.TabIndex = 2;
            textBox1.Text = "Transition Editor";
            textBox1.TextAlign = HorizontalAlignment.Center;
            // 
            // button_CommitWP
            // 
            button_CommitWP.Dock = DockStyle.Right;
            button_CommitWP.Location = new Point(484, 0);
            button_CommitWP.Name = "button_CommitWP";
            button_CommitWP.Size = new Size(176, 38);
            button_CommitWP.TabIndex = 2;
            button_CommitWP.Text = "Commit this WP to MES";
            button_CommitWP.UseVisualStyleBackColor = true;
            button_CommitWP.Click += button_CommitWP_Click;
            // 
            // panel2
            // 
            panel2.Controls.Add(listBox_WorkPlan);
            panel2.Controls.Add(panel4);
            panel2.Controls.Add(listBox_WPList);
            panel2.Dock = DockStyle.Left;
            panel2.Location = new Point(6, 6);
            panel2.Name = "panel2";
            panel2.Size = new Size(113, 456);
            panel2.TabIndex = 2;
            // 
            // listBox_WorkPlan
            // 
            listBox_WorkPlan.Dock = DockStyle.Fill;
            listBox_WorkPlan.FormattingEnabled = true;
            listBox_WorkPlan.ItemHeight = 15;
            listBox_WorkPlan.Location = new Point(0, 166);
            listBox_WorkPlan.Name = "listBox_WorkPlan";
            listBox_WorkPlan.Size = new Size(113, 290);
            listBox_WorkPlan.TabIndex = 4;
            listBox_WorkPlan.SelectedValueChanged += listBox_WorkPlan_SelectedValueChanged;
            // 
            // panel4
            // 
            panel4.Controls.Add(button_WorkPlanDelete);
            panel4.Controls.Add(button_WorkPlanSyncFromMES);
            panel4.Controls.Add(button_WorkPlanAdd);
            panel4.Dock = DockStyle.Top;
            panel4.Location = new Point(0, 0);
            panel4.Name = "panel4";
            panel4.Size = new Size(113, 166);
            panel4.TabIndex = 3;
            // 
            // button_WorkPlanDelete
            // 
            button_WorkPlanDelete.Dock = DockStyle.Top;
            button_WorkPlanDelete.Location = new Point(0, 44);
            button_WorkPlanDelete.Name = "button_WorkPlanDelete";
            button_WorkPlanDelete.Size = new Size(113, 43);
            button_WorkPlanDelete.TabIndex = 5;
            button_WorkPlanDelete.Text = "Delete WP";
            button_WorkPlanDelete.UseVisualStyleBackColor = true;
            // 
            // button_WorkPlanSyncFromMES
            // 
            button_WorkPlanSyncFromMES.Dock = DockStyle.Fill;
            button_WorkPlanSyncFromMES.Location = new Point(0, 44);
            button_WorkPlanSyncFromMES.Name = "button_WorkPlanSyncFromMES";
            button_WorkPlanSyncFromMES.Size = new Size(113, 122);
            button_WorkPlanSyncFromMES.TabIndex = 2;
            button_WorkPlanSyncFromMES.Text = "Sync From MES";
            button_WorkPlanSyncFromMES.UseVisualStyleBackColor = true;
            button_WorkPlanSyncFromMES.Click += button_WorkPlanSync_Click;
            // 
            // button_WorkPlanAdd
            // 
            button_WorkPlanAdd.Dock = DockStyle.Top;
            button_WorkPlanAdd.Location = new Point(0, 0);
            button_WorkPlanAdd.Name = "button_WorkPlanAdd";
            button_WorkPlanAdd.Size = new Size(113, 44);
            button_WorkPlanAdd.TabIndex = 2;
            button_WorkPlanAdd.Text = "Add WP";
            button_WorkPlanAdd.UseVisualStyleBackColor = true;
            button_WorkPlanAdd.Click += button_WorkPlanAdd_Click;
            // 
            // listBox_WPList
            // 
            listBox_WPList.BackColor = SystemColors.Info;
            listBox_WPList.Dock = DockStyle.Fill;
            listBox_WPList.FormattingEnabled = true;
            listBox_WPList.ItemHeight = 15;
            listBox_WPList.Location = new Point(0, 0);
            listBox_WPList.Name = "listBox_WPList";
            listBox_WPList.Size = new Size(113, 456);
            listBox_WPList.TabIndex = 1;
            // 
            // tabPage_SO
            // 
            tabPage_SO.BackColor = Color.Linen;
            tabPage_SO.Controls.Add(panel7);
            tabPage_SO.Controls.Add(panel3);
            tabPage_SO.Location = new Point(4, 27);
            tabPage_SO.Name = "tabPage_SO";
            tabPage_SO.Size = new Size(785, 468);
            tabPage_SO.TabIndex = 2;
            tabPage_SO.Text = "Sales Order";
            // 
            // panel7
            // 
            panel7.Controls.Add(dataGridView_SalesOrder);
            panel7.Controls.Add(panel8);
            panel7.Dock = DockStyle.Fill;
            panel7.Location = new Point(118, 0);
            panel7.Name = "panel7";
            panel7.Size = new Size(667, 468);
            panel7.TabIndex = 1;
            // 
            // dataGridView_SalesOrder
            // 
            dataGridView_SalesOrder.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dataGridView_SalesOrder.Dock = DockStyle.Fill;
            dataGridView_SalesOrder.Location = new Point(0, 46);
            dataGridView_SalesOrder.MultiSelect = false;
            dataGridView_SalesOrder.Name = "dataGridView_SalesOrder";
            dataGridView_SalesOrder.RowTemplate.Height = 25;
            dataGridView_SalesOrder.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridView_SalesOrder.Size = new Size(667, 422);
            dataGridView_SalesOrder.TabIndex = 7;
            // 
            // panel8
            // 
            panel8.Controls.Add(txtSelectedSoId);
            panel8.Controls.Add(btnAddTerm);
            panel8.Controls.Add(btnDeleteTerm);
            panel8.Controls.Add(btnModifyTerm);
            panel8.Controls.Add(btnCloneTerm);
            panel8.Controls.Add(textBox2);
            panel8.Controls.Add(btnPostSalesOrderToMES);
            panel8.Dock = DockStyle.Top;
            panel8.Location = new Point(0, 0);
            panel8.Name = "panel8";
            panel8.Size = new Size(667, 46);
            panel8.TabIndex = 6;
            // 
            // txtSelectedSoId
            // 
            txtSelectedSoId.BorderStyle = BorderStyle.None;
            txtSelectedSoId.Dock = DockStyle.Fill;
            txtSelectedSoId.Location = new Point(125, 0);
            txtSelectedSoId.Multiline = true;
            txtSelectedSoId.Name = "txtSelectedSoId";
            txtSelectedSoId.Size = new Size(66, 46);
            txtSelectedSoId.TabIndex = 5;
            // 
            // btnAddTerm
            // 
            btnAddTerm.Dock = DockStyle.Right;
            btnAddTerm.Location = new Point(191, 0);
            btnAddTerm.Name = "btnAddTerm";
            btnAddTerm.Size = new Size(64, 46);
            btnAddTerm.TabIndex = 0;
            btnAddTerm.Text = "Add Term";
            btnAddTerm.UseVisualStyleBackColor = true;
            btnAddTerm.Click += btnAddTerm_Click;
            // 
            // btnDeleteTerm
            // 
            btnDeleteTerm.Dock = DockStyle.Right;
            btnDeleteTerm.Location = new Point(255, 0);
            btnDeleteTerm.Name = "btnDeleteTerm";
            btnDeleteTerm.Size = new Size(116, 46);
            btnDeleteTerm.TabIndex = 1;
            btnDeleteTerm.Text = "Delete selected term";
            btnDeleteTerm.UseVisualStyleBackColor = true;
            // 
            // btnModifyTerm
            // 
            btnModifyTerm.Dock = DockStyle.Right;
            btnModifyTerm.Location = new Point(371, 0);
            btnModifyTerm.Name = "btnModifyTerm";
            btnModifyTerm.Size = new Size(115, 46);
            btnModifyTerm.TabIndex = 2;
            btnModifyTerm.Text = "Modify selected term";
            btnModifyTerm.UseVisualStyleBackColor = true;
            btnModifyTerm.Click += btnModifyTerm_Click;
            // 
            // btnCloneTerm
            // 
            btnCloneTerm.Dock = DockStyle.Right;
            btnCloneTerm.Location = new Point(486, 0);
            btnCloneTerm.Name = "btnCloneTerm";
            btnCloneTerm.Size = new Size(106, 46);
            btnCloneTerm.TabIndex = 3;
            btnCloneTerm.Text = "Clone selected term";
            btnCloneTerm.UseVisualStyleBackColor = true;
            // 
            // textBox2
            // 
            textBox2.BorderStyle = BorderStyle.None;
            textBox2.Dock = DockStyle.Left;
            textBox2.Location = new Point(0, 0);
            textBox2.Multiline = true;
            textBox2.Name = "textBox2";
            textBox2.Size = new Size(125, 46);
            textBox2.TabIndex = 4;
            textBox2.Text = "Sales Order Num:";
            textBox2.TextAlign = HorizontalAlignment.Right;
            // 
            // btnPostSalesOrderToMES
            // 
            btnPostSalesOrderToMES.Dock = DockStyle.Right;
            btnPostSalesOrderToMES.Location = new Point(592, 0);
            btnPostSalesOrderToMES.Name = "btnPostSalesOrderToMES";
            btnPostSalesOrderToMES.Size = new Size(75, 46);
            btnPostSalesOrderToMES.TabIndex = 7;
            btnPostSalesOrderToMES.Text = "Sync to MES";
            btnPostSalesOrderToMES.UseVisualStyleBackColor = true;
            btnPostSalesOrderToMES.Click += btnPostSalesOrderToMES_Click;
            // 
            // panel3
            // 
            panel3.Controls.Add(listBox_SO);
            panel3.Controls.Add(btnSyncSOFromMES);
            panel3.Controls.Add(btnDeleteSO);
            panel3.Controls.Add(btn_AddSO);
            panel3.Dock = DockStyle.Left;
            panel3.Location = new Point(0, 0);
            panel3.Name = "panel3";
            panel3.Size = new Size(118, 468);
            panel3.TabIndex = 0;
            // 
            // listBox_SO
            // 
            listBox_SO.Dock = DockStyle.Fill;
            listBox_SO.FormattingEnabled = true;
            listBox_SO.ItemHeight = 15;
            listBox_SO.Location = new Point(0, 127);
            listBox_SO.Name = "listBox_SO";
            listBox_SO.Size = new Size(118, 341);
            listBox_SO.TabIndex = 3;
            listBox_SO.SelectedIndexChanged += listBox_SO_SelectedIndexChanged;
            // 
            // btnSyncSOFromMES
            // 
            btnSyncSOFromMES.Dock = DockStyle.Top;
            btnSyncSOFromMES.Location = new Point(0, 86);
            btnSyncSOFromMES.Name = "btnSyncSOFromMES";
            btnSyncSOFromMES.Size = new Size(118, 41);
            btnSyncSOFromMES.TabIndex = 2;
            btnSyncSOFromMES.Text = "Sync From MES";
            btnSyncSOFromMES.UseVisualStyleBackColor = true;
            btnSyncSOFromMES.Click += btnSyncSOFromMES_Click;
            // 
            // btnDeleteSO
            // 
            btnDeleteSO.BackgroundImageLayout = ImageLayout.Stretch;
            btnDeleteSO.Dock = DockStyle.Top;
            btnDeleteSO.Location = new Point(0, 40);
            btnDeleteSO.Name = "btnDeleteSO";
            btnDeleteSO.Size = new Size(118, 46);
            btnDeleteSO.TabIndex = 1;
            btnDeleteSO.Text = "Delete";
            btnDeleteSO.UseVisualStyleBackColor = true;
            // 
            // btn_AddSO
            // 
            btn_AddSO.Dock = DockStyle.Top;
            btn_AddSO.Location = new Point(0, 0);
            btn_AddSO.Name = "btn_AddSO";
            btn_AddSO.Size = new Size(118, 40);
            btn_AddSO.TabIndex = 0;
            btn_AddSO.Text = "Add";
            btn_AddSO.UseVisualStyleBackColor = true;
            btn_AddSO.Click += btn_AddSO_Click;
            // 
            // tabPage_WO
            // 
            tabPage_WO.Location = new Point(4, 27);
            tabPage_WO.Name = "tabPage_WO";
            tabPage_WO.Padding = new Padding(3);
            tabPage_WO.Size = new Size(785, 468);
            tabPage_WO.TabIndex = 3;
            tabPage_WO.Text = "Work Order";
            tabPage_WO.UseVisualStyleBackColor = true;
            // 
            // tabPage_Ledger
            // 
            tabPage_Ledger.Controls.Add(rtxt_ledger);
            tabPage_Ledger.Controls.Add(btnReadLedger);
            tabPage_Ledger.Location = new Point(4, 27);
            tabPage_Ledger.Name = "tabPage_Ledger";
            tabPage_Ledger.Padding = new Padding(3);
            tabPage_Ledger.Size = new Size(785, 468);
            tabPage_Ledger.TabIndex = 4;
            tabPage_Ledger.Text = "Ledger View";
            tabPage_Ledger.UseVisualStyleBackColor = true;
            // 
            // rtxt_ledger
            // 
            rtxt_ledger.Dock = DockStyle.Fill;
            rtxt_ledger.Location = new Point(3, 40);
            rtxt_ledger.Name = "rtxt_ledger";
            rtxt_ledger.Size = new Size(779, 425);
            rtxt_ledger.TabIndex = 1;
            rtxt_ledger.Text = "";
            // 
            // btnReadLedger
            // 
            btnReadLedger.Dock = DockStyle.Top;
            btnReadLedger.Location = new Point(3, 3);
            btnReadLedger.Name = "btnReadLedger";
            btnReadLedger.Size = new Size(779, 37);
            btnReadLedger.TabIndex = 0;
            btnReadLedger.Text = "Read ledger ...";
            btnReadLedger.UseVisualStyleBackColor = true;
            btnReadLedger.Click += btnReadLedger_Click;
            // 
            // button_WPSync
            // 
            button_WPSync.Dock = DockStyle.Bottom;
            button_WPSync.Location = new Point(0, 335);
            button_WPSync.Name = "button_WPSync";
            button_WPSync.Size = new Size(293, 135);
            button_WPSync.TabIndex = 2;
            button_WPSync.Text = "Update Work Plan";
            button_WPSync.UseVisualStyleBackColor = true;
            // 
            // timer1
            // 
            timer1.Tick += timer1_Tick;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(13F, 28F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(793, 499);
            Controls.Add(tabControl1);
            Font = new Font("Consolas", 18F, FontStyle.Regular, GraphicsUnit.Point);
            Margin = new Padding(6);
            Name = "Form1";
            Text = "Master System View";
            Load += MainForm_Load;
            tabControl1.ResumeLayout(false);
            tabPage_WS.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)dataGridViewWorkStation).EndInit();
            panel1.ResumeLayout(false);
            tabPage_WP.ResumeLayout(false);
            panel5.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)dataGridView_WorkPlan).EndInit();
            panel6.ResumeLayout(false);
            panel6.PerformLayout();
            panel2.ResumeLayout(false);
            panel4.ResumeLayout(false);
            tabPage_SO.ResumeLayout(false);
            panel7.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)dataGridView_SalesOrder).EndInit();
            panel8.ResumeLayout(false);
            panel8.PerformLayout();
            panel3.ResumeLayout(false);
            tabPage_Ledger.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion
        private TabControl tabControl1;
        private TabPage tabPage_WP;

        private ListBox listBox_WPList;
        private Panel panel2;
        private Button button_WPSync;
        private TabPage tabPage_WS;
        private DataGridView dataGridViewWorkStation;
        private Panel panel1;
        private Button button_WorkStationModify;
        private Button button_WorkStationAdd;
        private Panel panel5;
        private DataGridView dataGridView_WorkPlan;
        private Panel panel4;
        private Button button_CommitWP;
        private Button button_WorkPlanAdd;
        private Panel panel6;
        private Button button_TransitionAdd;
        private TextBox textBox1;
        private System.Windows.Forms.Timer timer1;
        private Button button_WorkStationSync;
        private Button button_WorkPlanSyncFromMES;
        private TabPage tabPage_SO;
        private Panel panel7;
        private Panel panel3;
        private ListBox listBox_WorkPlan;
        private ListBox listBox_SO;
        private Button btnSyncSOFromMES;
        private Button btnDeleteSO;
        private Button btn_AddSO;
        private Button button_WorkPlanDelete;
        private Button button_TransitionDelete;
        private Button button_TransitionModify;
        private TabPage tabPage_WO;
        private TextBox txtSelectedSoId;
        private TextBox textBox2;
        private Button btnCloneTerm;
        private Button btnModifyTerm;
        private Button btnDeleteTerm;
        private Button btnAddTerm;
        private Panel panel8;
        private Button btnPostSalesOrderToMES;
        private DataGridView dataGridView_SalesOrder;
        private TabPage tabPage_Ledger;
        private RichTextBox rtxt_ledger;
        private Button btnReadLedger;
    }
}