"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { dashboardURL } from "@/lib/constants";
import Loading from "../loading";

interface UserData {
  name: string;
  college: string;
  phone: string;
  teamName?: string; // Make teamName optional
  isVerified?: boolean; // Add isVerified field
}

const Participants: React.FC<{ name: string }> = ({ name }) => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  if (name === "Dimensional Discourse ") {
    name = name.trim();
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("name from particpants", name);

        const response = await axios.post(`${dashboardURL}/getCSVData`, {
          name,
        });
        console.log(response.data.data);
        const extractedData = response.data.data.map((item: any) => ({
          name: item.name || item.teamLeaderName,
          college: item.collegeName,
          phone: item.whatsappNumber,
          teamName: item.teamName, // Extract teamName if it exists
          isVerified: item.isVerified,
        }));
        console.log(extractedData);
        setUserData(extractedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [name]); // Include name in dependency array

  return (
    <main className="md:w-full w-screen md:max-w-5xl md:mx-auto md:py-12  md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">{name}</h1>
      </header>
      <div className="overflow-x-auto">
        {loading ? (
          <Loading />
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Sl No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Phone</TableHead>
                {userData.some((user) => user.teamName) && (
                  <TableHead>Team Name</TableHead>
                )}
                <TableHead>Verified</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {userData.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.college}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  {/* Render teamName if it exists, otherwise render an empty cell */}
                  {user.teamName ? (
                    <TableCell>{user.teamName}</TableCell>
                  ) : (
                    <TableCell></TableCell>
                  )}
                  <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
};

export default Participants;
