import React from 'react';
import { CSVDownload } from "react-csv";


 

export default function Export (csvData) {
    
    return <CSVDownload data={csvData} target="_blank" />;
}