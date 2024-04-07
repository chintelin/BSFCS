# MGMT Smart Contract Usage Guide

This guide provides an overview of how to use the `BMES_MGMT` smart contract, which is designed for managing processes related to production within a Hyperledger Fabric blockchain network. The contract includes various methods for initializing and managing workstations, work plans, sales orders, and applying engineering change orders.

## Table of Contents

- [Initialization](#initialization)
- [WorkStation Management](#workstation-management)
- [WorkPlan Management](#workplan-management)
- [SalesOrder Management](#salesorder-management)
- [Engineering Change Order](#engineering-change-order)
- [General Utilities](#general-utilities)

## Initialization

Before using the contract, ensure it is properly initialized. The contract requires the initialization of workstations and work plans. Use the `InitWorkStationDoc` and `InitWorkPlanDoc` methods to set up the necessary documents.

## WorkStation Management

The contract provides methods for managing workstations, including creating, updating, and deleting workstations.

- **Create a WorkStation**: Use `PostWorkStation` to create a new workstation. You need to provide the workstation's name, function, parameters, endpoint, and protocol.
- **Update a WorkStation**: Use `UpdateWorkStation` to update an existing workstation's details.
- **Delete a WorkStation**: Use `DeleteWorkStation` to remove a workstation from the ledger.
- **Check WorkStation Existence**: Use `WorkStationExists` to check if a workstation exists in the ledger.
- **Retrieve All WorkStations**: Use `GetAllWorkStation` to fetch all workstations from the ledger.

## WorkPlan Management

Work plans define the sequence of operations required to produce a product. The contract includes methods for managing work plans.

- **Create a WorkPlan**: Use `PostWorkPlan` to create a new work plan. You need to provide the work plan's ID and details in JSON format.
- **Update a WorkPlan**: Use `UpdateWorkPlan` to update an existing work plan's details.
- **Retrieve a WorkPlan**: Use `GetWorkPlan` to fetch a specific work plan from the ledger by its ID.
- **Retrieve All WorkPlans**: Use `GetAllWorkPlan` to fetch all work plans from the ledger.

## SalesOrder Management

Sales orders represent the production of products according to specific work plans. The contract includes methods for managing sales orders.

- **Create a SalesOrder**: Use `InitSalesOrderDoc` to create a new sales order. You need to provide the sales order's ID and details.
- **Update a SalesOrder**: Use `UpdateSalesOrder` to update an existing sales order's details.
- **Retrieve a SalesOrder**: Use `GetSalesOrder` to fetch a specific sales order from the ledger by its ID.
- **Retrieve All SalesOrders**: Use `GetAllOrder` to fetch all sales orders from the ledger.
- **Retrieve SalesOrder State**: Use `GetSalesOrderState` to fetch the state of a specific sales order.

## Engineering Change Order

The contract allows for the application of engineering change orders to sales orders.

- **Apply an Engineering Change Order**: Use `ApplyEngineeringChangeOrder` to apply a change order to a sales order. You need to provide the sales order ID, sales term ID, new work plan ID, and a timestamp.

## General Utilities

The contract includes utility methods for general purposes.

- **Get All Objects**: Use `GetAllObject` to fetch all objects from the ledger.
- **Query History**: Use `getHistory` to retrieve the history of state changes for a specific key.

## Conclusion

The `BMES_MGMT` smart contract is a comprehensive tool for managing production processes within a Hyperledger Fabric blockchain network. By following this guide, you can effectively use the contract to manage workstations, work plans, sales orders, and apply engineering change orders, ensuring efficient and transparent production management.


Below is a detailed description of each method in the `BMES_MGMT` smart contract, including their input arguments and return values.

## API Refereneces

### WorkStation Management

#### `InitWorkStationDoc(ctx)`
- **Input**: `ctx` (Contract object)
- **Return**: None
- **Description**: Initializes workstations by creating a predefined set of workstation documents and storing them in the ledger.

#### `GetAllWorkStation(ctx)`
- **Input**: `ctx` (Contract object)
- **Return**: A string representation of an array containing all workstation objects.
- **Description**: Retrieves all workstation objects from the ledger and returns them as a JSON string.

#### `WorkStationExists(ctx, name)`
- **Input**: `ctx` (Contract object), `name` (String)
- **Return**: A boolean indicating whether the workstation exists.
- **Description**: Checks if a workstation with the given name exists in the ledger.

#### `PostWorkStation(ctx, name, func, parameter, endpoint, protocol)`
- **Input**: `ctx` (Contract object), `name` (String), `func` (String), `parameter` (String), `endpoint` (String), `protocol` (String)
- **Return**: None
- **Description**: Creates a new workstation with the provided details and stores it in the ledger.

#### `GetWorkStation(ctx, name)`
- **Input**: `ctx` (Contract object), `name` (String)
- **Return**: A string representation of the workstation object.
- **Description**: Retrieves a workstation object by its name from the ledger and returns it as a JSON string.

#### `UpdateWorkStation(ctx, name, func, parameter, endpoint, protocol)`
- **Input**: `ctx` (Contract object), `name` (String), `func` (String), `parameter` (String), `endpoint` (String), `protocol` (String)
- **Return**: None
- **Description**: Updates an existing workstation with the provided details in the ledger.

#### `DeleteWorkStation(ctx, name)`
- **Input**: `ctx` (Contract object), `name` (String)
- **Return**: None
- **Description**: Deletes a workstation with the given name from the ledger.

### WorkPlan Management

#### `InitWorkPlanDoc(ctx)`
- **Input**: `ctx` (Contract object)
- **Return**: None
- **Description**: Initializes work plans by creating a predefined set of work plan documents and storing them in the ledger.

#### `GetWorkPlan(ctx, id)`
- **Input**: `ctx` (Contract object), `id` (String)
- **Return**: A string representation of the work plan object.
- **Description**: Retrieves a work plan object by its ID from the ledger and returns it as a JSON string.

#### `GetAllWorkPlan(ctx)`
- **Input**: `ctx` (Contract object)
- **Return**: A string representation of an array containing all work plan objects.
- **Description**: Retrieves all work plan objects from the ledger and returns them as a JSON string.

#### `PostWorkPlan(ctx, wp_json)`
- **Input**: `ctx` (Contract object), `wp_json` (String)
- **Return**: None
- **Description**: Creates a new work plan with the provided details in JSON format and stores it in the ledger.

#### `UpdateWorkPlan(ctx, wp_json)`
- **Input**: `ctx` (Contract object), `wp_json` (String)
- **Return**: None
- **Description**: Updates an existing work plan with the provided details in JSON format in the ledger.

### SalesOrder Management

#### `InitSalesOrderDoc(ctx, str_ISO8601_timestamp)`
- **Input**: `ctx` (Contract object), `str_ISO8601_timestamp` (String)
- **Return**: None
- **Description**: Initializes sales orders by creating a predefined set of sales order documents and storing them in the ledger.

#### `GetSalesOrder(ctx, so_id)`
- **Input**: `ctx` (Contract object), `so_id` (String)
- **Return**: A string representation of the sales order object.
- **Description**: Retrieves a sales order object by its ID from the ledger and returns it as a JSON string.

#### `GetSalesOrderState(ctx, so_id)`
- **Input**: `ctx` (Contract object), `so_id` (String)
- **Return**: A string representation of the sales order state object.
- **Description**: Retrieves the state of a sales order by its ID from the ledger and returns it as a JSON string.

#### `GetAllOrder(ctx)`
- **Input**: `ctx` (Contract object)
- **Return**: A string representation of an array containing all sales order objects.
- **Description**: Retrieves all sales order objects from the ledger and returns them as a JSON string.

#### `UpdateSalesOrder(ctx, so_json)`
- **Input**: `ctx` (Contract object), `so_json` (String)
- **Return**: A string representation of the update result.
- **Description**: Updates an existing sales order with the provided details in JSON format in the ledger.

#### `ApplyEngineeringChangeOrder(ctx, salesOrderId, salesTermId, newWorkPlanId, str_ISO8601_timestamp)`
- **Input**: `ctx` (Contract object), `salesOrderId` (String), `salesTermId` (String), `newWorkPlanId` (String), `str_ISO8601_timestamp` (String)
- **Return**: A string representation of the updated sales order object.
- **Description**: Applies an engineering change order to a sales order by updating the referred work plan and tagging related information.

### General Utilities

#### `getHistory(ctx, id)`
- **Input**: `ctx` (Contract object), `id` (String)
- **Return**: An array of objects representing the history of state changes for the given key.
- **Description**: Retrieves the history of state changes for a specific key in the ledger.

#### `GetAllObject(ctx)`
- **Input**: `ctx` (Contract object)
- **Return**: A string representation of an array containing all objects from the ledger.
- **Description**: Retrieves all objects from the ledger and returns them as a JSON string.

> This document is generated by Phind after reading mgmt.js.