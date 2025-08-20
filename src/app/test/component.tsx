'use client'

import { useEffect, useState } from "react";

export interface ACSystemData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  energyConsumption: number;
  isActive: boolean;
}

export interface ACSystemDashboardProps {
  data: ACSystemData[];
}


const ACSystemDashboard = ({ data }: ACSystemDashboardProps) => {
    const [ systems, setSystems ] = useState<ACSystemData[]>(data)

  useEffect(() => {
  if (data?.length > 0) {
    setSystems(data);
  }
}, [data]);

    const setTempColor = (temprature: number) => {
        if (temprature > 27) return 'red'
        if (temprature >= 25) return 'orange'
        return 'green'
    }

    const toggleIsActive = (id: string) => {
        setSystems(prev => 
            prev.map(system => 
                system.id === id ? {...system, isActive: !system.isActive} : system
            )
        )
    }

    return (
        <div className="bg-white">
        {systems ? systems?.map(system => (
            <div key={system.id} className="mb-7 border-1">
                <p>{system.location}</p>
                <p style={{color: setTempColor(system.temperature)}}>{system.temperature}</p>
                <p>{system.humidity}</p>
                <p>{system.energyConsumption}</p>
                <button className="border-1 p-2" onClick={() => toggleIsActive(system.id)}>{system.isActive ? 'OFF' : 'ON'}</button>
            </div>)) : 'any data'}
        </div>
    )
}

export default ACSystemDashboard