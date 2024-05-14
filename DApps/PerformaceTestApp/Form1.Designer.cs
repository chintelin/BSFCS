namespace PerformaceTestApp
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
            buttonStart = new Button();
            tbMin = new TextBox();
            tbMax = new TextBox();
            label1 = new Label();
            label2 = new Label();
            tbPass_post = new TextBox();
            tbFailed_post = new TextBox();
            tbSR_post = new TextBox();
            label3 = new Label();
            label4 = new Label();
            label5 = new Label();
            timer1 = new System.Windows.Forms.Timer(components);
            button1 = new Button();
            tbSampleCount = new TextBox();
            label6 = new Label();
            label7 = new Label();
            label8 = new Label();
            label9 = new Label();
            tbPass_get = new TextBox();
            tbFailed_get = new TextBox();
            tbSR_get = new TextBox();
            label10 = new Label();
            label11 = new Label();
            SuspendLayout();
            // 
            // buttonStart
            // 
            buttonStart.Location = new Point(53, 34);
            buttonStart.Name = "buttonStart";
            buttonStart.Size = new Size(235, 120);
            buttonStart.TabIndex = 0;
            buttonStart.Text = "Start";
            buttonStart.UseVisualStyleBackColor = true;
            buttonStart.Click += buttonStart_Click;
            // 
            // tbMin
            // 
            tbMin.Location = new Point(53, 196);
            tbMin.Name = "tbMin";
            tbMin.Size = new Size(100, 23);
            tbMin.TabIndex = 1;
            tbMin.Text = "10";
            // 
            // tbMax
            // 
            tbMax.Location = new Point(169, 196);
            tbMax.Name = "tbMax";
            tbMax.Size = new Size(100, 23);
            tbMax.TabIndex = 2;
            tbMax.Text = "100000";
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(53, 181);
            label1.Name = "label1";
            label1.Size = new Size(29, 15);
            label1.TabIndex = 3;
            label1.Text = "Min";
            label1.Click += label1_Click;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(169, 181);
            label2.Name = "label2";
            label2.Size = new Size(32, 15);
            label2.TabIndex = 4;
            label2.Text = "Max";
            // 
            // tbPass_post
            // 
            tbPass_post.Location = new Point(346, 173);
            tbPass_post.Name = "tbPass_post";
            tbPass_post.Size = new Size(57, 23);
            tbPass_post.TabIndex = 5;
            // 
            // tbFailed_post
            // 
            tbFailed_post.Location = new Point(424, 173);
            tbFailed_post.Name = "tbFailed_post";
            tbFailed_post.Size = new Size(57, 23);
            tbFailed_post.TabIndex = 5;
            // 
            // tbSR_post
            // 
            tbSR_post.Location = new Point(498, 173);
            tbSR_post.Name = "tbSR_post";
            tbSR_post.Size = new Size(57, 23);
            tbSR_post.TabIndex = 5;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(346, 150);
            label3.Name = "label3";
            label3.Size = new Size(31, 15);
            label3.TabIndex = 4;
            label3.Text = "Pass";
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Location = new Point(424, 154);
            label4.Name = "label4";
            label4.Size = new Size(41, 15);
            label4.TabIndex = 4;
            label4.Text = "Failed";
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Location = new Point(498, 154);
            label5.Name = "label5";
            label5.Size = new Size(95, 15);
            label5.TabIndex = 4;
            label5.Text = "Successive Rate";
            // 
            // timer1
            // 
            timer1.Interval = 1000;
            timer1.Tick += timer1_Tick;
            // 
            // button1
            // 
            button1.Location = new Point(328, 43);
            button1.Name = "button1";
            button1.Size = new Size(244, 76);
            button1.TabIndex = 6;
            button1.Text = "Stop";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // tbSampleCount
            // 
            tbSampleCount.Location = new Point(125, 244);
            tbSampleCount.Name = "tbSampleCount";
            tbSampleCount.Size = new Size(100, 23);
            tbSampleCount.TabIndex = 7;
            tbSampleCount.Text = "30";
            // 
            // label6
            // 
            label6.AutoSize = true;
            label6.Location = new Point(64, 244);
            label6.Name = "label6";
            label6.Size = new Size(55, 15);
            label6.TabIndex = 3;
            label6.Text = "Samples";
            label6.Click += label1_Click;
            // 
            // label7
            // 
            label7.AutoSize = true;
            label7.Location = new Point(346, 222);
            label7.Name = "label7";
            label7.Size = new Size(31, 15);
            label7.TabIndex = 4;
            label7.Text = "Pass";
            // 
            // label8
            // 
            label8.AutoSize = true;
            label8.Location = new Point(424, 226);
            label8.Name = "label8";
            label8.Size = new Size(41, 15);
            label8.TabIndex = 4;
            label8.Text = "Failed";
            // 
            // label9
            // 
            label9.AutoSize = true;
            label9.Location = new Point(498, 226);
            label9.Name = "label9";
            label9.Size = new Size(95, 15);
            label9.TabIndex = 4;
            label9.Text = "Successive Rate";
            // 
            // tbPass_get
            // 
            tbPass_get.Location = new Point(346, 245);
            tbPass_get.Name = "tbPass_get";
            tbPass_get.Size = new Size(57, 23);
            tbPass_get.TabIndex = 5;
            // 
            // tbFailed_get
            // 
            tbFailed_get.Location = new Point(424, 245);
            tbFailed_get.Name = "tbFailed_get";
            tbFailed_get.Size = new Size(57, 23);
            tbFailed_get.TabIndex = 5;
            // 
            // tbSR_get
            // 
            tbSR_get.Location = new Point(498, 245);
            tbSR_get.Name = "tbSR_get";
            tbSR_get.Size = new Size(57, 23);
            tbSR_get.TabIndex = 5;
            // 
            // label10
            // 
            label10.AutoSize = true;
            label10.Font = new Font("Microsoft JhengHei UI", 12F, FontStyle.Bold, GraphicsUnit.Point);
            label10.Location = new Point(290, 172);
            label10.Name = "label10";
            label10.Size = new Size(50, 20);
            label10.TabIndex = 4;
            label10.Text = "POST";
            // 
            // label11
            // 
            label11.AutoSize = true;
            label11.Font = new Font("Microsoft JhengHei UI", 12F, FontStyle.Bold, GraphicsUnit.Point);
            label11.Location = new Point(290, 240);
            label11.Name = "label11";
            label11.Size = new Size(39, 20);
            label11.TabIndex = 4;
            label11.Text = "GET";
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(629, 288);
            Controls.Add(tbSampleCount);
            Controls.Add(button1);
            Controls.Add(tbSR_get);
            Controls.Add(tbSR_post);
            Controls.Add(tbFailed_get);
            Controls.Add(tbFailed_post);
            Controls.Add(tbPass_get);
            Controls.Add(tbPass_post);
            Controls.Add(label9);
            Controls.Add(label5);
            Controls.Add(label8);
            Controls.Add(label4);
            Controls.Add(label7);
            Controls.Add(label11);
            Controls.Add(label10);
            Controls.Add(label3);
            Controls.Add(label2);
            Controls.Add(label6);
            Controls.Add(label1);
            Controls.Add(tbMax);
            Controls.Add(tbMin);
            Controls.Add(buttonStart);
            Name = "Form1";
            Text = "Performance Test UI";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button buttonStart;
        private TextBox tbMin;
        private TextBox tbMax;
        private Label label1;
        private Label label2;
        private TextBox tbPass_post;
        private TextBox tbFailed_post;
        private TextBox tbSR_post;
        private Label label3;
        private Label label4;
        private Label label5;
        private System.Windows.Forms.Timer timer1;
        private Button button1;
        private TextBox tbSampleCount;
        private Label label6;
        private Label label7;
        private Label label8;
        private Label label9;
        private TextBox tbPass_get;
        private TextBox tbFailed_get;
        private TextBox tbSR_get;
        private Label label10;
        private Label label11;
    }
}