const db = require('../config/db');

// ✅ UUID with milliseconds
function generateCustomUUID() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${day}${month}${year}-${hours}${minutes}${seconds}${ms}`;
}

exports.submitForm = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ success: false, message: 'Missing request body' });
  }

  const {
    appName, domainName, appDetails, langUsed, dbUsed, frameworkUsed, appType,
    deptName, deptEmail, deptPhNum, deptAddrs,
    concurrentUsers, peakTime, loadBalance, ipv6Compatibility, tapeBackup,
    contactName = [], contactEmail = [], contactPhNum = [], contactDesignation = [], contactRole = [],
    vmName = [], vmType = [], coresCount = [], servicesVersions = [],
    osVersion = [], ram = [], storage = [], expectedGrowth = []
  } = req.body;

  if (!appName || !domainName || !appDetails || !langUsed || !dbUsed || !frameworkUsed || !appType)
    return res.status(400).json({ success: false, message: 'Missing required hosting info' });
  if (!deptName || !deptEmail || !deptPhNum || !deptAddrs)
    return res.status(400).json({ success: false, message: 'Missing required department info' });

  const uuid = generateCustomUUID();
  console.log('🟢 Generated UUID:', uuid);

  const conn = await db.getConnection(); // works fine with pool.promise()

  try {
    await conn.beginTransaction();
    console.log('🚀 Transaction started');

    // 🧩 1. hosting_details
    await conn.query(
      `INSERT INTO hosting_details 
       (uuid, appName, domainName, appDetails, langUsed, dbUsed, frameworkUsed, appType)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuid, appName, domainName, appDetails, langUsed, dbUsed, frameworkUsed, appType]
    );
    console.log('✅ hosting_details inserted');

    // 🧩 2. department_details
    await conn.query(
      `INSERT INTO department_details (deptName, deptEmail, deptPhNum, deptAddrs, uuid)
       VALUES (?, ?, ?, ?, ?)`,
      [deptName, deptEmail, deptPhNum, deptAddrs, uuid]
    );
    console.log('✅ department_details inserted');

    // 🧩 3. contact_details
    if (contactName.length > 0) {
      const contactQuery = `
        INSERT INTO contact_details
        (contactName, contactEmail, contactPhNum, contactDesignation, contactRole, uuid)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      for (let i = 0; i < contactName.length; i++) {
        await conn.query(contactQuery, [
          contactName[i] || null,
          contactEmail[i] || null,
          contactPhNum[i] || null,
          contactDesignation[i] || null,
          contactRole[i] || null,
          uuid
        ]);
      }
      console.log('✅ contact_details inserted:', contactName.length);
    } else {
      console.log('⚠️ No contact details provided');
    }

    // 🧩 4. additional_info
    await conn.query(
      `INSERT INTO additional_info
       (concurrentUsers, peakTime, loadBalance, ipv6Compatibility, uuid, tapeBackup)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [concurrentUsers || null, peakTime || null, loadBalance || null, ipv6Compatibility || null, uuid, tapeBackup || null]
    );
    console.log('✅ additional_info inserted');

    // 🧩 5. vm_details
    if (vmName.length > 0) {
      const vmQuery = `
        INSERT INTO vm_details
        (vmName, vmType, coresCount, servicesVersions, osVersion, ram, storage, expectedGrowth, uuid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      for (let i = 0; i < vmName.length; i++) {
        await conn.query(vmQuery, [
          vmName[i] || null,
          vmType[i] || null,
          coresCount[i] || null,
          servicesVersions[i] || null,
          osVersion[i] || null,
          ram[i] || null,
          storage[i] || null,
          expectedGrowth[i] || null,
          uuid
        ]);
      }
      console.log('✅ vm_details inserted:', vmName.length);
    } else {
      console.log('⚠️ No VM details provided');
    }

    await conn.commit();

const baseUrl = "http://192.168.177.79:3000";

res.status(200).json({
  success: true,
  uuid,
  redirectUrl: `${baseUrl}/generate-pdf/${uuid}`
});

  } catch (err) {
    console.error('❌ Transaction failed:', err);
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
    console.log('🔚 Connection released');
  }
};
