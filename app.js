import express from "express";
import { logger } from "./config/loggingConfig.js";
import connectDB from "./config/dbConfig.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import config from "./config/serverConfig.js";
import errorHandler from "./middlewares/errorHandler.js";
import {
  accountantProtect,
  adminProtect,
  crmProtect,
  protect,
  superAdminProtect,
} from "./middlewares/protect.js";

import ro_user from "./routes/user.js";
import ro_utils from "./routes/utils.js";
import ro_posts from "./routes/pro-post.js";
import ro_projects from "./routes/pro-projects.js";
import ro_products from "./routes/pro-products.js";
import category from "./routes/catogory.js";
import ro_brands from "./routes/brand.js";
import searchRoutes from "./routes/serch.js";
import ro_message from "./routes/message.js";
import ro_notification from "./routes/notification.js";
import ro_order from "./routes/order.js";
import ro_enq from "./routes/enq.js";
import ro_fo from "./routes/followersRoutes.js";
import ro_adr from "./routes/deliveryAddressRoutes.js";
import ro_review from "./routes/review.js";
import ro_qs from "./routes/qs.js";
import ro_ans from "./routes/ans.js";
import instantService from "./routes/instantService.js";
import adminBaseRoutes from "./routes/admin/baseRoutes.js";
import adminAuthRoutes from "./routes/admin/authRoutes.js";
import crmRoutes from "./routes/admin/crmRoutes.js";
import superAdminRoutes from "./routes/admin/superAdminRoutes.js";
import accountantRoutes from "./routes/admin/accountantRoutes.js";

const app = express();

connectDB();

// app.use(rateLimiter);
// Body parser middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
// app.use(requestLoggerMiddleware);

// Use OTP routes
app.use("/api/user", ro_user);
app.use("/api/utils", ro_utils);
app.use("/api/posts", ro_posts);
app.use("/api/projects", ro_projects);
app.use("/api/products", ro_products);
app.use("/api/category", category);
app.use("/api/brand", ro_brands);
app.use("/api/qs", ro_qs);
app.use("/api/ans", ro_ans);
app.use("/api", searchRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api", protect, ro_message);
app.use("/api", protect, ro_notification);
app.use("/api/order", protect, ro_order);
app.use("/api", protect, ro_enq);
app.use("/api", protect, ro_fo);
app.use("/api/adr", protect, ro_adr);
app.use("/api/review", protect, ro_review);
app.use("/api/instantService", protect, instantService);
app.use("/api/admin", protect, adminProtect, adminBaseRoutes);
app.use("/api/crm", protect, crmProtect, crmRoutes);
app.use("/api/accountant", protect, accountantProtect, accountantRoutes);
app.use("/api/super-admin", protect, superAdminProtect, superAdminRoutes);

// Example route
app.get("/", (req, res) => {
  res.json({ status: "running in main branch now testing..." });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Not Found",
    error: {
      code: 404,
      description: "The requested resource could not be found",
    },
  });
});

// Use error handler middleware (after all routes and other middleware)
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () =>
  logger.info(
    `Server running in ${config.nodeEnv} mode on https://localhost:${PORT}`
  )
);

export default app;
