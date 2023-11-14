import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Papa from "papaparse";
import sewer_design from "./assets/sewer_design.csv";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ExportExcel from "./components/export_excel";
import "./App.css";

export default function App() {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();

  useEffect(() => {
    const fetchParseData = async (params) => {
      Papa.parse(sewer_design, {
        download: true,
        delimiter: ",",
        complete: (result) => {
          setRowData(
            result.data.slice(1).map((dataOfEachRow) => {
              const rowObject = {};
              result.data[0].forEach((key, index) => {
                rowObject[key] = dataOfEachRow[index];
              });
              console.log(rowObject);
              return rowObject;
            })
          );
          setColumnDefs(
            result.data[0].map((columnKey) => ({
              headerName: columnKey,
              field: columnKey,
            }))
          );
        },
      });
    };
    fetchParseData();
  }, []);
  // console.log(fetchColumnDefs);
  // console.log(fetchRowData[0]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: "agNumberColumnFilter",
      filterParams: { buttons: ["apply", "clear", "cancel", "reset"] },
      floatingFilter: true,
      tooltipField: "Pipe",

      resizable: true,
    }),
    []
  );
  const paginationNumberFormatter = useCallback((params) => {
    console.log("[" + params.value.toLocaleString() + "]");

    return "[" + params.value.toLocaleString() + "]";
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.paginationGoToPage(4);
  }, []);

  const onPageSizeChanged = useCallback(() => {
    var value = document.getElementById("page-size").value;
    gridRef.current.api.paginationSetPageSize(Number(value));
  }, []);
  const cellClickListener = useCallback((e) => {
    console.log("cellClicked: ", e);
  });
  return (
    <div className="ag-theme-alpine" style={{ height: 550 }}>
      <ExportExcel />
      <select
        onChange={onPageSizeChanged}
        id="page-size"
        className="pagination-dropdown"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <AgGridReact
        ref={gridRef}
        onCellClicked={cellClickListener}
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection="multiple"
        animateRows={true}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        // paginationAutoPageSize={true}
        paginationNumberFormatter={paginationNumberFormatter}
        onFirstDataRendered={onFirstDataRendered}
        enableBrowserTooltips={true}
      />
    </div>
  );
}
