import { useState, useEffect } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/all");
      const data = await res.json();
      setLinks(data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url, shortCode: code }),
      });
      const data = await res.json();
      if (data.error) return alert(data.error);
      alert(`Short link created: ${data.shortUrl}`);
      setUrl(""); setCode(""); fetchLinks();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (code) => {
    try {
      await fetch(`http://localhost:5000/api/delete/${code}`, { method: "DELETE" });
      fetchLinks();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">TinyLink Dashboard</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow mb-6">
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Original URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border px-3 py-2 rounded text-gray-800"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Custom Short Code (optional)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="eg: mylink"
            className="w-full border px-3 py-2 rounded text-gray-800"
          />
        </div>
        <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Create Short Link
        </button>
      </form>

      <div className="w-full max-w-5xl bg-white p-4 rounded shadow overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Links</h2>
        <table className="w-full border-collapse table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">Code</th>
              <th className="border px-3 py-2 text-left">Short URL</th>
              <th className="border px-3 py-2 text-left">Original URL</th>
              <th className="border px-3 py-2 text-left">Clicks</th>
              <th className="border px-3 py-2 text-left">Last Clicked</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.code} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-gray-800">{link.code}</td>
                <td className="border px-3 py-2 text-blue-600 hover:underline truncate max-w-xs">
                  <a
                    href={`http://localhost:5000/${link.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`http://localhost:5000/${link.code}`}
                  </a>
                </td>
                <td className="border px-3 py-2 text-gray-800 truncate max-w-xs" title={link.original_url}>
                  {link.original_url}
                </td>
                <td className="border px-3 py-2 text-gray-800">{link.total_clicks}</td>
                <td className="border px-3 py-2 text-gray-800">
                  {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : "-"}
                </td>
                <td className="border px-3 py-2 text-gray-800">
                  <button
                    onClick={() => handleDelete(link.code)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
