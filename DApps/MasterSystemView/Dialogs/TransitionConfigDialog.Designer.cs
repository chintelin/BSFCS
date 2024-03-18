namespace MasterSystemView
{
    partial class TransitionConfigDialog
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
            txtID = new TextBox();
            label2 = new Label();
            txtWorkStation = new TextBox();
            label3 = new Label();
            txtFunction = new TextBox();
            label4 = new Label();
            txtParameter = new TextBox();
            label5 = new Label();
            txtOKTo = new TextBox();
            label6 = new Label();
            txtNOKTo = new TextBox();
            btnOK = new Button();
            btnCancel = new Button();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(22, 31);
            label1.Name = "label1";
            label1.Size = new Size(19, 15);
            label1.TabIndex = 0;
            label1.Text = "ID";
            // 
            // txtID
            // 
            txtID.Location = new Point(106, 28);
            txtID.Name = "txtID";
            txtID.Size = new Size(100, 23);
            txtID.TabIndex = 1;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(22, 65);
            label2.Name = "label2";
            label2.Size = new Size(77, 15);
            label2.TabIndex = 0;
            label2.Text = "WorkStation";
            // 
            // txtWorkStation
            // 
            txtWorkStation.Location = new Point(106, 62);
            txtWorkStation.Name = "txtWorkStation";
            txtWorkStation.Size = new Size(100, 23);
            txtWorkStation.TabIndex = 1;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(22, 99);
            label3.Name = "label3";
            label3.Size = new Size(55, 15);
            label3.TabIndex = 0;
            label3.Text = "Function";
            // 
            // txtFunction
            // 
            txtFunction.Location = new Point(106, 96);
            txtFunction.Name = "txtFunction";
            txtFunction.Size = new Size(100, 23);
            txtFunction.TabIndex = 1;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Location = new Point(22, 133);
            label4.Name = "label4";
            label4.Size = new Size(65, 15);
            label4.TabIndex = 0;
            label4.Text = "Parameter";
            // 
            // txtParameter
            // 
            txtParameter.Location = new Point(106, 130);
            txtParameter.Name = "txtParameter";
            txtParameter.Size = new Size(100, 23);
            txtParameter.TabIndex = 1;
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Location = new Point(22, 167);
            label5.Name = "label5";
            label5.Size = new Size(44, 15);
            label5.TabIndex = 0;
            label5.Text = "OK_To";
            // 
            // txtOKTo
            // 
            txtOKTo.Location = new Point(106, 164);
            txtOKTo.Name = "txtOKTo";
            txtOKTo.Size = new Size(100, 23);
            txtOKTo.TabIndex = 1;
            // 
            // label6
            // 
            label6.AutoSize = true;
            label6.Location = new Point(22, 201);
            label6.Name = "label6";
            label6.Size = new Size(54, 15);
            label6.TabIndex = 0;
            label6.Text = "NOK_To";
            // 
            // txtNOKTo
            // 
            txtNOKTo.Location = new Point(106, 198);
            txtNOKTo.Name = "txtNOKTo";
            txtNOKTo.Size = new Size(100, 23);
            txtNOKTo.TabIndex = 1;
            // 
            // btnOK
            // 
            btnOK.Location = new Point(247, 119);
            btnOK.Name = "btnOK";
            btnOK.Size = new Size(75, 48);
            btnOK.TabIndex = 2;
            btnOK.Text = "OK";
            btnOK.UseVisualStyleBackColor = true;
            btnOK.Click += btnOK_Click;
            // 
            // btnCancel
            // 
            btnCancel.DialogResult = DialogResult.Cancel;
            btnCancel.Location = new Point(247, 173);
            btnCancel.Name = "btnCancel";
            btnCancel.Size = new Size(75, 48);
            btnCancel.TabIndex = 2;
            btnCancel.Text = "Cancel";
            btnCancel.UseVisualStyleBackColor = true;
            // 
            // TransitionConfigDialog
            // 
            AcceptButton = btnOK;
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            CancelButton = btnCancel;
            ClientSize = new Size(356, 248);
            Controls.Add(btnCancel);
            Controls.Add(btnOK);
            Controls.Add(txtNOKTo);
            Controls.Add(txtOKTo);
            Controls.Add(txtParameter);
            Controls.Add(txtFunction);
            Controls.Add(txtWorkStation);
            Controls.Add(txtID);
            Controls.Add(label6);
            Controls.Add(label5);
            Controls.Add(label4);
            Controls.Add(label3);
            Controls.Add(label2);
            Controls.Add(label1);
            Name = "TransitionConfigDialog";
            Text = "WorkPlanConfigDialog";
            Load += TransitionConfigDialog_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private TextBox txtID;
        private Label label2;
        private TextBox txtWorkStation;
        private Label label3;
        private TextBox txtFunction;
        private Label label4;
        private TextBox txtParameter;
        private Label label5;
        private TextBox txtOKTo;
        private Label label6;
        private TextBox txtNOKTo;
        private Button btnOK;
        private Button btnCancel;
    }
}