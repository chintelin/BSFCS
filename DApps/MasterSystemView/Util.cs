using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace MasterSystemView
{
    public enum Operation { Add, Modify };

    public class WorkStationDef
    {
        public string Name { get; set; } = "";
        public string Function { get; set; } = "";
        public string Parameters { get; set; } = "";
        public string Endpoint { get; set; } = "";
        public string Protocol { get; set; } = "";
    }

    public class TransitionDef
    {
        public string ID { get; set; } = "";
        public string WorkStation { get; set; } = "";
        public string Function { get; set; } = "";
        public string Parameter { get; set; } = ""; // 使用逗號 ',' 分隔
        public string OK_To { get; set; } = "";
        public string NOK_To { get; set; } = "";
    }

    public class WorkPlanDef
    {
        public string ID { get; set; } = "";
        public Dictionary<string, TransitionDef> TransitionList { get; set; }
           = new Dictionary<string, TransitionDef>();
    }

    public class SalesTermDef
    {
        public string ID { get; set; } = "";
        public string ProductName { get; set; } = "";        
        public string RefWorkPlan { get; set; } = "";
        public string State { get; set; } = "Waiting"; //Waiting > Started > Finished
        public string Start { get; set; } = "";
        public string Stop { get; set; } = "";
    }

    public class SalesOrderDef
    {
        public string ID { get; set; } = "";
        public string Release { get; set; } = "";
        public string Start { get; set; } = ""; // 時間格式：YYYY-MM-DD-hh-mm-ss
        public string Stop { get; set; } = "";
        public Dictionary<string, SalesTermDef> SalesTerms { get; set; }
            = new Dictionary<string, SalesTermDef>();


    }

    public class TimeStamp
    {
        public static string Now
        { 
            get { return DateTime.Now.ToString("o"); } // "o" 是一個格式規範，代表ISO 8601格式
        }
        public static DateTime Iso8601StringToDateTime(string iso8601String)
        {
            DateTime dateTime;
            // 使用DateTime.TryParse方法嘗試轉換
            if (DateTime.TryParse(iso8601String, out dateTime))
            {
                Console.WriteLine("Successfully parsed: " + dateTime);
                return dateTime;
            }
            else
            {
                throw new FormatException("Input string cannot be converted to DateTime object");
            }
        }
    }

}
