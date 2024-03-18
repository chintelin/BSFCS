using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MasterSystemView
{
    public partial class TransitionConfigDialog : Form
    {
        public TransitionDef Transition { get; set; } = new TransitionDef();

        public TransitionConfigDialog()
        {
            InitializeComponent();
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            if (txtID.Text == string.Empty)
            {
                MessageBox.Show("ID must be assigned");
                this.DialogResult = DialogResult.Cancel;
            }
            else
            {
                this.Transition.ID = txtID.Text;
                this.Transition.WorkStation = txtWorkStation.Text;
                this.Transition.Function = txtFunction.Text;
                this.Transition.Parameter = txtParameter.Text;
                this.Transition.OK_To = txtOKTo.Text;
                this.Transition.NOK_To = txtNOKTo.Text;
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
        }

        private void TransitionConfigDialog_Load(object sender, EventArgs e)
        {           
            txtID.Text = this.Transition.ID;
            txtWorkStation.Text = this.Transition.WorkStation;
            txtFunction.Text = this.Transition.Function;
            txtParameter.Text = this.Transition.Parameter;
            txtOKTo.Text = this.Transition.OK_To;
            txtNOKTo.Text = this.Transition.NOK_To;
        }
    }
}
