using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterSystemView
{
    internal abstract class AsyncContainer
    {
        internal bool IsUpdated { get; set; } = false;

    }

    /*
     * the following classes should be genericalized. 
     */
    internal class WorkStationContainer : AsyncContainer
    {
        internal List<WorkStationDef> Value { get; private set; } = new List<WorkStationDef>();
        internal void Update(List<WorkStationDef> wslist)
        {
            Value = wslist;
            IsUpdated = true;
        }

    }

    internal class WorkPlanContainer : AsyncContainer
    {
        internal Dictionary<string, WorkPlanDef> Dict { get; private set; } = new Dictionary<string, WorkPlanDef>();

        internal void Update(List<WorkPlanDef> wpDict)
        {
            lock (Dict)
            {
                var newkeyValuePairs = new Dictionary<string, WorkPlanDef>();
                foreach (var wp in wpDict)
                {
                    string id = wp.ID;
                    newkeyValuePairs[id] = wp;
                }
                Dict = newkeyValuePairs;
                IsUpdated = true;
            }
        }

        internal WorkPlanDef this[string id]
        {
            get { return Dict[id]; }
            set
            {
                lock (Dict)
                {
                    Dict[id] = value;
                    IsUpdated = true;
                }
            }
        }
    }

    internal class SalesOrderContainer : AsyncContainer
    {
        internal Dictionary<string, SalesOrderDef> Dict = new Dictionary<string, SalesOrderDef>();

        internal void Update(Dictionary<string, SalesOrderDef> soDict)
        {
            lock (Dict)
            {

                Dict = soDict;
                IsUpdated = true;
            }
        }

        internal SalesOrderDef this[string id]
        {
            get { return Dict[id]; }
            set
            {
                lock (Dict)
                {
                    Dict[id] = value;
                    IsUpdated = true;
                }
            }
        }
    }

    internal class LedgerContainer : AsyncContainer
    {
        private string json = string.Empty;
        internal string Json
        {
            get
            { return json; }
            set
            {
                json = value;
                IsUpdated = true;
            }
        }
    }
}//end namespace
