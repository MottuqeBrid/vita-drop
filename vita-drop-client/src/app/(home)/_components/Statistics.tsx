"use client";

import { motion } from "framer-motion";

type BloodGroupStat = {
  group: string;
  count: number;
};

export default function Statistics() {
  const totalDonors = 512;
  const livesSaved = 873;
  const totalRegistered = 654;
  const emergencyNeeded = 6;

  const bloodGroupStats: BloodGroupStat[] = [
    { group: "A+", count: 45 },
    { group: "B+", count: 38 },
    { group: "O+", count: 60 },
    { group: "AB+", count: 20 },
    { group: "A-", count: 10 },
    { group: "B-", count: 9 },
    { group: "O-", count: 24 },
    { group: "AB-", count: 5 },
  ];

  return (
    <section className="py-10 bg-base-100">
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Platform Statistics
        </h2>

        {/* Summary Stats */}
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center mb-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          <motion.div
            className="bg-primary/10 p-5 sm:p-6 rounded-lg shadow-md"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold">Total Donors</h3>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {totalDonors}
            </p>
          </motion.div>
          <motion.div
            className="bg-secondary/10 p-5 sm:p-6 rounded-lg shadow-md"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold">Lives Saved</h3>
            <p className="text-2xl sm:text-3xl font-bold text-secondary">
              {livesSaved}
            </p>
          </motion.div>
          <motion.div
            className="bg-accent/10 p-5 sm:p-6 rounded-lg shadow-md"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold">
              Registered Users
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-accent">
              {totalRegistered}
            </p>
          </motion.div>
          <motion.div
            className="bg-error/10 p-5 sm:p-6 rounded-lg shadow-md"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold">
              Emergency Needed
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-error">
              {emergencyNeeded}
            </p>
          </motion.div>
        </motion.div>

        {/* Blood Group Availability */}
        <motion.div
          className="bg-base-200 p-4 sm:p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 80,
            damping: 18,
          }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Available Blood Group Donors
          </h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 text-center">
            {bloodGroupStats.map(({ group, count }) => (
              <motion.div
                key={group}
                className="p-3 sm:p-4 bg-white rounded shadow hover:shadow-md transition"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 120,
                  damping: 16,
                }}
              >
                <p className="text-base sm:text-lg font-bold">{group}</p>
                <p className="text-primary font-semibold text-sm sm:text-base">
                  {count} donors
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
