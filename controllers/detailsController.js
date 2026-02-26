const db = require("../config/db");

exports.getSubmittedForms = async (req, res) => {
  const query = `
    SELECT 
      hd.uuid, 
      hd.appName, hd.domainName, hd.langUsed, hd.dbUsed, hd.frameworkUsed, hd.appType, 
      dd.deptName, dd.deptEmail, dd.deptAddrs, dd.deptPhNum, 
      af.concurrentUsers, af.peakTime, af.loadBalance, af.ipv6Compatibility, af.tapeBackup,

      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'contactName', cd.contactName,
            'contactEmail', cd.contactEmail,
            'contactPhNum', cd.contactPhNum,
            'contactDesignation', cd.contactDesignation,
            'contactRole', cd.contactRole
          )
        )
        FROM contact_details cd
        WHERE cd.uuid = hd.uuid
      ) AS contactDetails,

      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'vmName', vd.vmName,
            'vmType', vd.vmType,
            'coresCount', vd.coresCount,
            'servicesVersions', vd.servicesVersions,
            'osVersion', vd.osVersion,
            'ram', vd.ram,                       
            'storage', vd.storage,
            'expectedGrowth', vd.expectedGrowth   
          )
        )
        FROM vm_details vd
        WHERE vd.uuid = hd.uuid
      ) AS vmDetails

    FROM hosting_details hd
    LEFT JOIN department_details dd ON hd.uuid = dd.uuid
    LEFT JOIN additional_info af ON hd.uuid = af.uuid
    ORDER BY hd.slNo DESC;
  `;

  try {
    const [results] = await db.query(query);

    if (!results || results.length === 0) {
      return res.render("dashboard/details", { forms: [] });
    }

    const parsedResults = results.map(form => {
      let vmDetails = [];
      let contactDetails = [];

      // Safely parse JSON fields
     try {
  vmDetails = form.vmDetails
    ? (typeof form.vmDetails === "string"
        ? JSON.parse(form.vmDetails)
        : form.vmDetails)
    : [];
} catch (e) {
  console.warn(`⚠️ Failed to parse vmDetails for UUID ${form.uuid}`, e);
}


     try {
  contactDetails = form.contactDetails
    ? (typeof form.contactDetails === "string"
        ? JSON.parse(form.contactDetails)
        : form.contactDetails)
    : [];
} catch (e) {
  console.warn(`⚠️ Failed to parse contactDetails for UUID ${form.uuid}`, e);
}


      return {
        ...form,
        vmDetails,
        contactDetails
      };
    });

    res.render("dashboard/details", { forms: parsedResults });

  } catch (err) {
    console.error("❌ Error fetching or processing forms:", err);
    res.status(500).send("Internal Server Error");
  }
};




