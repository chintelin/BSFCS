using Newtonsoft.Json;
using System.Text;
using System.Transactions;

namespace PerformaceTestApp
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private static readonly HttpClient client = new HttpClient();
        private int Min = 0;
        private int Max = 100;
        private int PostPass = 0;
        private int PostFailed = 0;
        private double PostSucessiveRate { get { return (double)(PostPass / (double)(PostPass + PostFailed)); } }
        private int GetPass = 0;
        private int GetFailed = 0;
        private double GetSucessiveRate { get { return (double)(GetPass / (double)(GetPass + GetFailed)); } }
        private bool isStop = false;
        private Random random = new Random();
        string post_url = @"http://localhost:1337/PostTesting";
        string get_url = @"http://localhost:1337/GetTesting";

        private async void buttonStart_Click(object sender, EventArgs e)
        {
            isStop = false;
            PostPass = 0;
            PostFailed = 0;
            GetPass = 0;
            GetFailed = 0;
            Min = Convert.ToInt32(tbMin.Text);
            Max = Convert.ToInt32(tbMax.Text);
            int n = Convert.ToInt32(tbSampleCount.Text);

            //計算反函數的上下限
            double min_log = Math.Log(Min, 10);
            double max_log = Math.Log(Max, 10);
            double dx = (max_log - min_log) / 10;

            timer1.Start();
            for (int d = 0; d < 10; d++)
            {
                for (int i = 0; i < n; i++)
                {
                    double r = random.NextDouble();
                    double power = min_log + dx * i + dx * r;
                    double target_L = Math.Pow(10, power);
                    int L = (int)(target_L);
                    Data data = new Data(L);
                    await Task.Run(async () =>
                    {
                        await TestPost(post_url, data);
                        System.Threading.Thread.Sleep(100);
                        await TestGet(get_url, data);
                    });

                    if (isStop)
                        break;
                }
            }
        }


        private async Task TestPost(string url, Data data)
        {
            try
            {
                string json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Response: " + responseContent);
                    PostPass++;
                }
                else
                {
                    Console.WriteLine("Failed to send  data. Status code: " + response.StatusCode);
                    string[] lines = new string[] { string.Format("{0}", data.payload.Length) };
                    //System.IO.File.AppendAllLines("PostError.txt", lines);
                    PostFailed++;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

        private async Task TestGet(string url, Data data)
        {
            try
            {
                string json = JsonConvert.SerializeObject(data);
                HttpResponseMessage response = await client.GetAsync(url + @"/?key=" + data.ID.ToString());

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Response: " + responseContent);
                    GetPass++;
                }
                else
                {
                    Console.WriteLine("Failed to send  data. Status code: " + response.StatusCode);
                    string[] lines = new string[] { string.Format("{0}", data.payload.Length) };
                    System.IO.File.AppendAllLines("GetError.txt", lines);
                    GetFailed++;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            tbMin.Text = Min.ToString();
            tbMax.Text = Max.ToString();

            tbPass_post.Text = PostPass.ToString();
            tbFailed_post.Text = PostFailed.ToString();
            tbSR_post.Text = this.PostSucessiveRate.ToString();

            tbPass_get.Text = GetPass.ToString();
            tbFailed_get.Text = GetFailed.ToString();
            tbSR_get.Text = this.GetSucessiveRate.ToString();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            isStop = true;
            timer1.Stop();
        }
    }
}