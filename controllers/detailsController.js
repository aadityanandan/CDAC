const db = require("../config/db");

exports.getSubmittedForms = (req, res) => {
  const query = `
    SELECT 
      hd.uuid, 
      hd.appName, hd.langUsed, hd.dbUsed, hd.frameworkUsed, hd.appType, 
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
            'storage', vd.storage
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

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).send("Database error");
    }

    if (!results || results.length === 0) {
      return res.render("dashboard/details", { forms: [] });
    }

    try {
      const parsedResults = results.map(form => ({
        ...form, 
        vmDetails: form.vmDetails && typeof form.vmDetails === "string" ? JSON.parse(form.vmDetails) : [],
        contactDetails: form.contactDetails && typeof form.contactDetails === "string" ? JSON.parse(form.contactDetails) : []
      }));

      res.render("dashboard/details", { forms: parsedResults });
    } catch (parseErr) {
      console.error("❌ JSON Parse Error:", parseErr);
      res.status(500).send("Parsing error");
    }
  });
};


