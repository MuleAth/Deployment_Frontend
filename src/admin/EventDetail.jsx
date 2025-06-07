import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaFilePdf, FaDownload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch event details from backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `https://sportalon-backend.onrender.com/api/admin/events/${id}`,
          {
            credentials: "include", // Include cookies for authentication
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        if (data.success) {
          setEvent(data.event);
        } else {
          throw new Error(data.message || "Event not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleNavigateToEvents = () => {
    navigate("/admin/events");
  };
  
  // Function to download event participants as PDF
  const downloadParticipantsPDF = () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");
      
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add college logo or name as header
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 153); // Dark blue
      doc.text("Sinhgad College of Engineering", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
      // Add title
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(`${event.title} - Participants List`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
      
      // Add event details
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text(`Event Date: ${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}`, 14, 40);
      doc.text(`Location: ${event.location}`, 14, 45);
      doc.text(`Sports Category: ${event.sportsCategory}`, 14, 50);
      doc.text(`Organizer: ${event.organizer}`, 14, 55);
      
      // Add generation date
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${date}`, doc.internal.pageSize.getWidth() - 14, 40, { align: 'right' });
      
      // Add participant count
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Participants: ${event.participants.length}`, 14, 65);
      
      // Prepare table data
      const tableColumn = ["No.", "Name", "Email", "Mobile Number", "Department", "Year"];
      const tableRows = [];
      
      event.participants.forEach((participant, index) => {
        const userData = [
          index + 1,
          participant.fullname,
          participant.email,
          participant.mobile_number,
          participant.department || 'N/A',
          participant.year || 'N/A'
        ];
        tableRows.push(userData);
      });
      
      // Generate the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          lineColor: [200, 200, 200]
        },
        headStyles: {
          fillColor: [0, 51, 153], // Dark blue
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [240, 245, 255]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { fontStyle: 'bold' }
        },
        didDrawPage: function(data) {
          // Footer with page numbers
          const pageCount = doc.internal.getNumberOfPages();
          const str = `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`;
          doc.setFontSize(8);
          doc.text(str, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
          
          // Add a footer with college name
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text('Sinhgad College of Engineering - Sports Department', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }
      });
      
      // Generate a filename with date and event name
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const sanitizedEventName = event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const filename = `${sanitizedEventName}-participants-${formattedDate}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      // Update toast
      toast.update(loadingToast, { 
        render: "Participants list downloaded successfully!", 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return <div className="content-area">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="content-area">
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleNavigateToEvents}
          className="mt-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="content-area">
        <p>Event not found.</p>
        <button
          onClick={handleNavigateToEvents}
          className="mt-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="content-area">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleNavigateToEvents}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
        
        {event.participants && event.participants.length > 0 && (
          <button
            onClick={downloadParticipantsPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            title="Download a PDF of all participants"
          >
            <FaFilePdf className="text-lg" /> <span className="font-medium">Download Participants PDF</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Event Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Start Date
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    End Date
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Sports Category
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.sportsCategory}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Organizer
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.organizer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400">
                    Contact
                  </label>
                  <p className="text-gray-800 dark:text-gray-300">
                    {event.contact}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {event.description}
              </p>

              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Rules
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {event.rules.split("\n").map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>

              <h2 className="text-lg font-semibold mt-6 mb-4 text-gray-800 dark:text-white">
                Prizes
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {event.prizes.split("\n").map((prize, index) => (
                  <li key={index}>{prize}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Participants
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total: {event.participants.length}
            </div>
          </div>
          
          {event.participants.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">No participants have registered for this event yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Mobile
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Department
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-300">
                      Year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {event.participants.map((participant, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {participant.fullname}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {participant.mobile_number}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {participant.email}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {participant.department || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-300">
                        {participant.year || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetail;