import { useState } from "react";
import "./Converter.scss";

export default function Converter() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const fileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const fileConvert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          if (!Array.isArray(jsonContent) || jsonContent.length === 0) {
            setError("Nepravilan JSON format ili prazan array.");
            return;
          }
          const csvContent = jsonToCsv(jsonContent);
          downloadCsv(csvContent);
        } catch (e) {
          setError("Parsiranje neuspjesno.");
        }
      };
      reader.readAsText(file);
    } else {
      setError("Odaberite JSON datoteku.");
    }
  };

  const jsonToCsv = (json) => {
    const keys = Object.keys(json[0]);
    const csvRows = [keys.join(",")];

    json.forEach((row) => {
      const values = keys.map((key) => row[key]);
      csvRows.push(values.join(","));
    });

    return csvRows.join("\n");
  };

  const downloadCsv = (csv) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <input
        className="converter__input"
        type="file"
        accept=".json"
        onChange={fileChange}
      />
      <button className="converter__btn" onClick={fileConvert}>
        Pretvori u CSV
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
