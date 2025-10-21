import { http } from "./http";


const API = {
    // cskh
    // API mới - Lấy thông tin lịch sử log theo biển số xe bãi đỗ
     getVehicleAuditLog: async (token, plateNumber, startTime, endTime) => await http.get(`/api/cskh/vehicle/parking/audit-log?plateNumber=${plateNumber}&startTime=${startTime}&endTime=${endTime}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),

    // API mới - Lấy thông tin đầy đủ xe bãi đỗ
    getFullVehicleInfo: async (token, plateNumber) => await http.get(`/api/cskh/vehicle/parking/full-info?plateNumber=${plateNumber}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),


    getVehicleOCS: async (token,epc) => await http.get(`/api/cskh/ocs/query-vehicle?epc=${epc}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),

    getVehicleCRM: async (token,epc) => await http.get(`/api/cskh/crm/query-vehicle?epc=${epc}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),

    getHistoryVehicleCSTC: async (token,epc) => await http.get(`/api/cskh/crm/query-history-vehicle-cstc?epc=${epc}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),

    updateStatusVehicle : async (token, vehicleId, actType) => await http.put(`/api/cskh/crm/updateStatusVehicle?vehicleId=${vehicleId}&actType=${actType}`,
    {},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }), 

    createVehicleOCS : async (token, vehicleId) => await http.put(`/api/cskh/ocs/add-vehilce?vehicleId=${vehicleId}`,
    {},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),

    deleteVehicleOCS : async (token, epc, contractId) => await http.put(`/api/cskh/ocs/delete-vehilce?epc=${epc}&contractId=${contractId}`,
    {},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    updatePlateNumber : async (token, vehicleId, plateNumberNew) => await http.put(`/api/cskh/crm/change-plateNumber?vehicleId=${vehicleId}&plateNumberNew=${plateNumberNew}`,
    {},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    exportReportError: async (token,startTime,endTime,optionTool) => await http.get(`/api/gsvh/get-report-errors?startTime=${startTime}&endTime=${endTime}&optionTool=${optionTool}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    //Xóa sms
    deleteSmS: async (token,contractId) => await http.put(`/api/cskh/crm/delete-sms?contractId=${contractId}`,
    {},
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),

    // lịch sử thay đổi hóa đơn
    getHistoryChangeBillCyCle: async (token,contractId) => await http.get(`/api/cskh/get-history-bill-cycle?contractID=${contractId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    getChangeBillCycle: async (token,contractId) => await http.get(`/api/cskh/get-change-bill-cycle?contractID=${contractId}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    getUserBlackList: async (token, username) => await http.get(`/api/kd/get-user-black-list?username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
    unlockUserBlackList: async (token, username) => await http.put(`/api/kd/update-user-black-list?username=${username}&status=${1}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),

    lockUserBlackList: async (token, username) => await http.put(`/api/kd/update-user-black-list?username=${username}&status=${0}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }),
}

export default API