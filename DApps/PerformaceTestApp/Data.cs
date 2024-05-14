using System.Text;


namespace PerformaceTestApp
{
    public class Data
    {
        public Data(int length) 
        {
            this.ID = AutoID.Value.ToString("D20");
            this.payload = AutoID.GetRandomString(length);
        }

        public string ID { get; set; } = "";
        public string payload { get; set; } = "";
    }

    internal class AutoID
    {
        static private int s = 0;

        static internal int Value { 
            get 
            { 
                int v = s;
                s++;
                return v; 
            } 
        }

        public static string GetRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var result = new StringBuilder(length);

            for (int i = 0; i < length; i++)
                result.Append(chars[random.Next(chars.Length)]);

            return result.ToString();
        }
    }
}
