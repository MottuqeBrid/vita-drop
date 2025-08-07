export default function AboutUs() {
  return (
    <div className="py-10 space-y-12">
      {/* Brief Description */}
      <section>
        <h1 className="text-4xl font-bold text-primary mb-4">About VitaDrop</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          VitaDrop is a dedicated platform committed to saving lives through
          voluntary blood donation. Our mission is to connect donors with
          recipients seamlessly and foster a strong community of compassionate
          individuals who understand the value of a single drop of blood.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-secondary mb-2">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            To create a reliable, safe, and efficient blood donation system that
            empowers donors and ensures timely support to those in urgent need.
            We strive to promote awareness and make donation accessible to
            everyone, everywhere.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary mb-2">
            Our Vision
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            A world where no life is lost due to a shortage of blood. We
            envision a future where every community is self-sufficient in blood
            supply, driven by voluntary donors and cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Why Blood Donation Is Important */}
      <section>
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          Why Blood Donation Is Important
        </h2>
        <ul className="list-disc pl-6 text-gray-700 text-lg space-y-2">
          <li>Every donation can save up to three lives.</li>
          <li>
            It helps maintain a stable blood supply for emergencies, surgeries,
            and chronic illnesses.
          </li>
          <li>Blood cannot be manufactured — donations are the only source.</li>
          <li>It promotes community solidarity and compassion.</li>
          <li>Regular donation can even offer health benefits to donors.</li>
        </ul>
      </section>
    </div>
  );
}
