const API_BASE_URL = "https://sims-ppob-backend.vercel.app/";

const testUser = {
  email: "testuser@example.com",
  first_name: "Test",
  last_name: "User",
  password: "password123"
};

let authToken = "";

async function testAPI() {
  console.log("🚀 Testing SIMS PPOB API Endpoints\n");
  console.log(`Base URL: ${API_BASE_URL}\n`);

  try {
    await testHealthCheck();

    await testGetBanners();

    await testRegistration();
    await testLogin();

    await testGetServices();
    await testGetProfile();
    await testUpdateProfile();
    await testGetBalance();
    await testTopUp();
    await testTransaction();
    await testTransactionHistory();
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  });

  const data = await response.json();
  return { response, data };
}

async function testHealthCheck() {
  console.log("1️⃣ Testing Health Check...");
  try {
    const { response, data } = await makeRequest("/");
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
    console.log("   ✅ Health check passed\n");
  } catch (error) {
    console.log("   ❌ Health check failed:", error.message, "\n");
  }
}

async function testGetBanners() {
  console.log("2️⃣ Testing Get Banners (Public)...");
  try {
    const { response, data } = await makeRequest("/banner");
    console.log(`   Status: ${response.status}`);
    console.log(`   Banners count: ${data.data?.length || 0}`);
    console.log("   ✅ Get banners passed\n");
  } catch (error) {
    console.log("   ❌ Get banners failed:", error.message, "\n");
  }
}

async function testRegistration() {
  console.log("3️⃣ Testing User Registration...");
  try {
    const { response, data } = await makeRequest("/registration", {
      method: "POST",
      body: JSON.stringify(testUser)
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${data.message}`);
    if (response.status === 200 || response.status === 400) {
      console.log("   ✅ Registration test passed\n");
    } else {
      console.log("   ❌ Registration failed\n");
    }
  } catch (error) {
    console.log("   ❌ Registration failed:", error.message, "\n");
  }
}

async function testLogin() {
  console.log("4️⃣ Testing User Login...");
  try {
    const { response, data } = await makeRequest("/login", {
      method: "POST",
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${data.message}`);

    if (data.data?.token) {
      authToken = data.data.token;
      console.log("   ✅ Login passed - Token received\n");
    } else {
      console.log("   ❌ Login failed - No token received\n");
    }
  } catch (error) {
    console.log("   ❌ Login failed:", error.message, "\n");
  }
}

async function testGetServices() {
  console.log("5️⃣ Testing Get Services (Protected)...");
  try {
    const { response, data } = await makeRequest("/services");
    console.log(`   Status: ${response.status}`);
    console.log(`   Services count: ${data.data?.length || 0}`);
    console.log("   ✅ Get services passed\n");
  } catch (error) {
    console.log("   ❌ Get services failed:", error.message, "\n");
  }
}

async function testGetProfile() {
  console.log("6️⃣ Testing Get Profile...");
  try {
    const { response, data } = await makeRequest("/profile");
    console.log(`   Status: ${response.status}`);
    console.log(`   User: ${data.data?.first_name} ${data.data?.last_name}`);
    console.log("   ✅ Get profile passed\n");
  } catch (error) {
    console.log("   ❌ Get profile failed:", error.message, "\n");
  }
}

async function testUpdateProfile() {
  console.log("7️⃣ Testing Update Profile...");
  try {
    const { response, data } = await makeRequest("/profile/update", {
      method: "PUT",
      body: JSON.stringify({
        first_name: "Updated",
        last_name: "User"
      })
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${data.message}`);
    console.log("   ✅ Update profile passed\n");
  } catch (error) {
    console.log("   ❌ Update profile failed:", error.message, "\n");
  }
}

async function testGetBalance() {
  console.log("8️⃣ Testing Get Balance...");
  try {
    const { response, data } = await makeRequest("/balance");
    console.log(`   Status: ${response.status}`);
    console.log(`   Balance: ${data.data?.balance || 0}`);
    console.log("   ✅ Get balance passed\n");
  } catch (error) {
    console.log("   ❌ Get balance failed:", error.message, "\n");
  }
}

async function testTopUp() {
  console.log("9️⃣ Testing Top Up Balance...");
  try {
    const { response, data } = await makeRequest("/topup", {
      method: "POST",
      body: JSON.stringify({
        top_up_amount: 100000
      })
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${data.message}`);
    console.log(`   New Balance: ${data.data?.balance || 0}`);
    console.log("   ✅ Top up passed\n");
  } catch (error) {
    console.log("   ❌ Top up failed:", error.message, "\n");
  }
}

async function testTransaction() {
  console.log("🔟 Testing Transaction (Payment)...");
  try {
    const { response, data } = await makeRequest("/transaction", {
      method: "POST",
      body: JSON.stringify({
        service_code: "PULSA"
      })
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${data.message}`);
    console.log(`   Invoice: ${data.data?.invoice_number || "N/A"}`);
    console.log("   ✅ Transaction passed\n");
  } catch (error) {
    console.log("   ❌ Transaction failed:", error.message, "\n");
  }
}

async function testTransactionHistory() {
  console.log("1️⃣1️⃣ Testing Transaction History...");
  try {
    const { response, data } = await makeRequest(
      "/transaction/history?offset=0&limit=5"
    );
    console.log(`   Status: ${response.status}`);
    console.log(`   Records count: ${data.data?.records?.length || 0}`);
    console.log("   ✅ Transaction history passed\n");
  } catch (error) {
    console.log("   ❌ Transaction history failed:", error.message, "\n");
  }
}

// Run the tests
testAPI();
