export default function NewsAndUpdates() {
  return (
    <div className="py-10 space-y-12">
      {/* Awareness Campaigns */}
      <section>
        <h2 className="text-3xl font-bold text-primary mb-4">
          Awareness Campaigns
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          We regularly organize awareness campaigns in schools, colleges, and
          workplaces to educate people about the importance of blood donation.
          These campaigns aim to break myths, inspire voluntary participation,
          and build a stronger donor community.
        </p>
        <ul className="list-disc pl-6 text-gray-700 text-lg space-y-2">
          <li>“Be a Hero” College Tour 2025</li>
          <li>Corporate Awareness Week - June 2025</li>
          <li>World Blood Donor Day Webinar - June 14</li>
        </ul>
      </section>

      {/* Recent Drives / Events */}
      <section>
        <h2 className="text-3xl font-bold text-secondary mb-4">
          Recent Drives & Events
        </h2>
        <div className="space-y-4">
          <div className="bg-base-100 shadow-md rounded-xl p-4">
            <h3 className="text-xl font-semibold">
              Khulna Citywide Blood Drive - July 25, 2025
            </h3>
            <p className="text-gray-600">
              Over 300 units of blood collected across 5 different locations.
            </p>
          </div>
          <div className="bg-base-100 shadow-md rounded-xl p-4">
            <h3 className="text-xl font-semibold">
              Emergency Flood Relief Camp – August 1, 2025
            </h3>
            <p className="text-gray-600">
              Organized emergency donations for flood victims in northern
              districts.
            </p>
          </div>
        </div>
      </section>

      {/* Blood Shortage Alert */}
      <section className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          🚨 Blood Shortage Alert
        </h2>
        <p className="text-gray-800 text-lg">
          We&#39;re currently facing a shortage of the following blood types:
        </p>
        <ul className="list-disc pl-6 mt-2 text-red-700 font-medium space-y-1">
          <li>O- (Universal Donor)</li>
          <li>A-</li>
          <li>AB+</li>
        </ul>
        <p className="text-gray-700 mt-4">
          If you or someone you know has these blood types and is eligible to
          donate, please come forward. Your donation can save lives.
        </p>
      </section>
    </div>
  );
}
