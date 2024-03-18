using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MasterSystemView.Dialogs
{
    internal partial class SalesTermConfigDialog : Form
    {
        WorkPlanContainer wpc;
        internal SalesTermConfigDialogResult Result = new SalesTermConfigDialogResult();
        internal SalesTermConfigDialog(WorkPlanContainer wpc)
        {
            InitializeComponent();
            this.wpc = wpc;
        }

        private void SalesTermConfigDialog_Load(object sender, EventArgs e)
        {
            txtName.Text = "Default Product";
            var work_plan_ids = wpc.Dict.Keys.ToArray();

            cbWorkPlans.Items.AddRange(work_plan_ids);
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            Result.ProductName = txtName.Text;
            Result.ReferedWorkPlan = cbWorkPlans.SelectedItem.ToString();
            Result.Quantity = Convert.ToInt32(numericUpDown_Quantity.Value);
        }
    }

    public class SalesTermConfigDialogResult
    {
        public string ProductName = string.Empty;
        public string ReferedWorkPlan = string.Empty;
        public int Quantity = 1;
    }
}
