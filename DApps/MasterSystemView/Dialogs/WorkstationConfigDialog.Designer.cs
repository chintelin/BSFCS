namespace MasterSystemView
{
    partial class WorkstationDialog
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
            txtWSName = new TextBox();
            label2 = new Label();
            txtWSFuncion = new TextBox();
            label3 = new Label();
            txtWSParameters = new TextBox();
            label4 = new Label();
            txtWSEndpoint = new TextBox();
            label5 = new Label();
            txtWSProtocol = new TextBox();
            buttonOK = new Button();
            buttonCancel = new Button();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(31, 32);
            label1.Name = "label1";
            label1.Size = new Size(81, 30);
            label1.TabIndex = 0;
            label1.Text = "Name";
            // 
            // txtName
            // 
            txtWSName.Location = new Point(293, 32);
            txtWSName.Name = "txtName";
            txtWSName.Size = new Size(423, 38);
            txtWSName.TabIndex = 1;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(31, 89);
            label2.Name = "label2";
            label2.Size = new Size(113, 30);
            label2.TabIndex = 0;
            label2.Text = "Function";
            // 
            // txtFunction
            // 
            txtWSFuncion.Location = new Point(293, 89);
            txtWSFuncion.Name = "txtFunction";
            txtWSFuncion.Size = new Size(423, 38);
            txtWSFuncion.TabIndex = 1;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(31, 146);
            label3.Name = "label3";
            label3.Size = new Size(249, 30);
            label3.TabIndex = 0;
            label3.Text = "Available Parameters";
            // 
            // txtAvailableParameters
            // 
            txtWSParameters.Location = new Point(293, 146);
            txtWSParameters.Name = "txtAvailableParameters";
            txtWSParameters.Size = new Size(423, 38);
            txtWSParameters.TabIndex = 1;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Location = new Point(31, 203);
            label4.Name = "label4";
            label4.Size = new Size(116, 30);
            label4.TabIndex = 0;
            label4.Text = "Endpoint";
            // 
            // txtEndpoint
            // 
            txtWSEndpoint.Location = new Point(293, 203);
            txtWSEndpoint.Name = "txtEndpoint";
            txtWSEndpoint.Size = new Size(423, 38);
            txtWSEndpoint.TabIndex = 1;
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Location = new Point(31, 260);
            label5.Name = "label5";
            label5.Size = new Size(108, 30);
            label5.TabIndex = 0;
            label5.Text = "Protocol";
            // 
            // txtProtocol
            // 
            txtWSProtocol.Location = new Point(293, 260);
            txtWSProtocol.Name = "txtProtocol";
            txtWSProtocol.Size = new Size(423, 38);
            txtWSProtocol.TabIndex = 1;
            // 
            // buttonOK
            // 
            buttonOK.DialogResult = DialogResult.OK;
            buttonOK.Location = new Point(367, 312);
            buttonOK.Name = "buttonOK";
            buttonOK.Size = new Size(150, 46);
            buttonOK.TabIndex = 2;
            buttonOK.Text = "OK";
            buttonOK.UseVisualStyleBackColor = true;
            buttonOK.Click += buttonOK_Click;
            // 
            // buttonCancel
            // 
            buttonCancel.DialogResult = DialogResult.Cancel;
            buttonCancel.Location = new Point(566, 312);
            buttonCancel.Name = "buttonCancel";
            buttonCancel.Size = new Size(150, 46);
            buttonCancel.TabIndex = 2;
            buttonCancel.Text = "Cancel";
            buttonCancel.UseVisualStyleBackColor = true;
            // 
            // WorkstationDialog
            // 
            AcceptButton = buttonOK;
            AutoScaleDimensions = new SizeF(14F, 30F);
            AutoScaleMode = AutoScaleMode.Font;
            CancelButton = buttonCancel;
            ClientSize = new Size(762, 393);
            Controls.Add(buttonCancel);
            Controls.Add(buttonOK);
            Controls.Add(txtWSProtocol);
            Controls.Add(txtWSEndpoint);
            Controls.Add(txtWSParameters);
            Controls.Add(txtWSFuncion);
            Controls.Add(txtWSName);
            Controls.Add(label5);
            Controls.Add(label4);
            Controls.Add(label3);
            Controls.Add(label2);
            Controls.Add(label1);
            Name = "WorkstationDialog";
            Text = "Work Station Dialog";
            Load += WorkstationDialog_Load;
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        protected TextBox txtWSName;
        private Label label2;
        protected TextBox txtWSFuncion;
        private Label label3;
        protected TextBox txtWSParameters;
        private Label label4;
        protected TextBox txtWSEndpoint;
        private Label label5;
        protected TextBox txtWSProtocol;
        private Button buttonOK;
        protected Button buttonCancel;
    }
}