// FOLLOWING CODES ARE MOCK SERVER IMPLEMENTATION
// YOU NEED TO BUILD YOUR OWN SERVER
// IF YOU NEED HELP ABOUT SERVER SIDE IMPLEMENTATION
// CONTACT US AT support@ui-lib.com
import MockAdapter from "axios-mock-adapter";
import { users } from "./data";

export const UsersEndpoints = (Mock: MockAdapter) => {
  Mock.onGet("/api/user-list").reply(() => {
    try {
      return [200, users];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });

  Mock.onGet("/api/user-list/1").reply(() => {
    try {
      return [200, users[0]];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });

  Mock.onGet("/api/user-list/id-list").reply(() => {
    try {
      const idList = users.map((item) => ({ params: { id: item.id } }));
      return [200, idList];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });

  // LOGIN ENDPOINT
  Mock.onPost("/api/users/login").reply((config) => {
    try {
      const { email, password } = JSON.parse(config.data || "{}");
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        // Don't return password in response
        const { password: _, ...userWithoutPassword } = user;
        return [200, userWithoutPassword];
      }

      return [401, { message: "Invalid email or password" }];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });

  // REGISTER ENDPOINT
  Mock.onPost("/api/users/register").reply((config) => {
    try {
      const data = JSON.parse(config.data || "{}");
      const { name, email, password, role = "customer" } = data;

      // Check if user already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return [400, { message: "User already exists" }];
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        phone: "",
        avatar: "/assets/images/faces/propic.png",
        dateOfBirth: new Date().toISOString(),
        verified: false,
        role: role as "customer" | "vendor" | "admin",
        name: {
          firstName: name.split(" ")[0] || name,
          lastName: name.split(" ").slice(1).join(" ") || ""
        }
      };

      users.push(newUser);

      // Don't return password in response
      const { password: _, ...userWithoutPassword } = newUser;
      return [200, userWithoutPassword];
    } catch (err) {
      console.error(err);
      return [500, { message: "Internal server error" }];
    }
  });
};
