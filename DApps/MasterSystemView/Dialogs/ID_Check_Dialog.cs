using System;
using System.Collections;
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
    public partial class ID_Check_Diglog : Form
    {
        public string AssignedID { get; set; } = string.Empty;
        List<string> str_id_list = new List<string>();

        public ID_Check_Diglog(List<string> id_List)
        {
            InitializeComponent();
            str_id_list = id_List;
        }

        private void ID_Check_Load(object sender, EventArgs e)
        {
            List<int> int_id_list = str_id_list.Select(int.Parse).ToList();
            var max = int_id_list.Max();
            txtID.Text = (max + 1).ToString();
        }

        private void button_OK_Click(object sender, EventArgs e)
        {
            AssignedID = txtID.Text;
            this.DialogResult = DialogResult.OK;
        }

        private void button_Cancel_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
        }
    }
}
