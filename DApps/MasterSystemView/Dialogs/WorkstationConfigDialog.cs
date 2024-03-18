using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MasterSystemView
{
    public partial class WorkstationDialog : Form
    {
        private Operation operation = Operation.Add;

        public WorkStationDef Content { get; set; } = new WorkStationDef();

        public WorkstationDialog(Operation operation)
        {
            this.operation = operation;
            InitializeComponent();

            if (this.operation == Operation.Modify)
            {
                txtWSName.Enabled = false;
            }
        }

        private void buttonOK_Click(object sender, EventArgs e)
        {
            // 從WorkstationForm獲取輸入的資訊
            Content = new WorkStationDef();

            Content.Name = txtWSName.Text;
            Content.Function = txtWSFuncion.Text;
            Content.Parameters = txtWSParameters.Text;
            Content.Endpoint = txtWSEndpoint.Text;
            Content.Protocol = txtWSProtocol.Text;
        }

        private void WorkstationDialog_Load(object sender, EventArgs e)
        {
            txtWSName.Text = Content.Name;
            txtWSFuncion.Text = Content.Function;
            txtWSParameters.Text = Content.Parameters;
            txtWSEndpoint.Text = Content.Endpoint;
            txtWSProtocol.Text = Content.Protocol;
        }
    }


}
