"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Country {
  name: string;
  code: string; // dial code like "+91"
}

export default function CountrySelect({
  onChange,
}: {
  onChange: (value: { name: string; code: string }) => void;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("/api/countries");
        setCountries(res.data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading countries...</p>;

  return (
    <select
      className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      onChange={(e) => {
        const value = e.target.value;
        const [name, code] = value.split("||");
        onChange({ name, code });
      }}
    >
      <option value="">Select country</option>
      {countries.map((c) => (
        <option key={`${c.name}-${c.code}`} value={`${c.name}||${c.code}`}>
          {c.name} ({c.code})
        </option>
      ))}
    </select>
  );
}
