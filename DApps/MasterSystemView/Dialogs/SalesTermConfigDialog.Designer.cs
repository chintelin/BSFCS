namespace MasterSystemView.Dialogs
{
    partial class SalesTermConfigDialog
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
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
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            label1 = new Label();
            cbWorkPlans = new ComboBox();
            label2 = new Label();
            numericUpDown_Quantity = new NumericUpDown();
            label3 = new Label();
            txtName = new TextBox();
            btnOK = new Button();
            btnCancel = new Button();
            ((System.ComponentModel.ISupportInitialize)numericUpDown_Quantity).BeginInit();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(30, 58);
            label1.Name = "label1";
            label1.Size = new Size(64, 15);
            label1.TabIndex = 0;
            label1.Text = "Work Plan";
            // 
            // cbWorkPlans
            // 
            cbWorkPlans.FormattingEnabled = true;
            cbWorkPlans.Location = new Point(104, 55);
            cbWorkPlans.Name = "cbWorkPlans";
            cbWorkPlans.Size = new Size(121, 23);
            cbWorkPlans.TabIndex = 1;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(30, 101);
            label2.Name = "label2";
            label2.Size = new Size(55, 15);
            label2.TabIndex = 0;
            label2.Text = "Quantity";
            // 
            // numericUpDown_Quantity
            // 
            numericUpDown_Quantity.Location = new Point(104, 99);
            numericUpDown_Quantity.Maximum = new decimal(new int[] { 32, 0, 0, 0 });
            numericUpDown_Quantity.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            numericUpDown_Quantity.Name = "numericUpDown_Quantity";
            numericUpDown_Quantity.Size = new Size(120, 23);
            numericUpDown_Quantity.TabIndex = 2;
            numericUpDown_Quantity.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(29, 18);
            label3.Name = "label3";
            label3.Size = new Size(42, 15);
            label3.TabIndex = 0;
            label3.Text = "Name";
            // 
            // txtName
            // 
            txtName.Location = new Point(104, 15);
            txtName.Name = "txtName";
            txtName.Size = new Size(121, 23);
            txtName.TabIndex = 3;
            // 
            // btnOK
            // 
            btnOK.DialogResult = DialogResult.OK;
            btnOK.Location = new Point(30, 145);
            btnOK.Name = "btnOK";
            btnOK.Size = new Size(75, 54);
            btnOK.TabIndex = 4;
            btnOK.Text = "OK";
            btnOK.UseVisualStyleBackColor = true;
            btnOK.Click += btnOK_Click;
            // 
            // btnCancel
            // 
            btnCancel.DialogResult = DialogResult.Cancel;
            btnCancel.Location = new Point(149, 145);
            btnCancel.Name = "btnCancel";
            btnCancel.Size = new Size(75, 54);
            btnCancel.TabIndex = 4;
            btnCancel.Text = "Cancel";
            btnCancel.UseVisualStyleBackColor = true;
            // 
            // SalesTermConfigDialog
            // 
            AcceptButton = btnOK;
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            CancelButton = btnCancel;
            ClientSize = new Size(263, 211);
            Controls.Add(btnCancel);
            Controls.Add(btnOK);
            Controls.Add(txtName);
            Controls.Add(numericUpDown_Quantity);
            Controls.Add(cbWorkPlans);
            Controls.Add(label2);
            Controls.Add(label3);
            Controls.Add(label1);
            MaximizeBox = false;
            MinimizeBox = false;
            Name = "SalesTermConfigDialog";
            Text = "SalesTermConfigDialog";
            Load += SalesTermConfigDialog_Load;
            ((System.ComponentModel.ISupportInitialize)numericUpDown_Quantity).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private ComboBox cbWorkPlans;
        private Label label2;
        private NumericUpDown numericUpDown_Quantity;
        private Label label3;
        private TextBox txtName;
        private Button btnOK;
        private Button btnCancel;
    }
}