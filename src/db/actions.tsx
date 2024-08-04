"use server";

import { db } from ".";

let ld = Date.now() - 24 * 60 * 60 * 1000;
let lastDay = new Date(ld).toISOString();
let lw = Date.now() - 168 * 60 * 60 * 1000;
let lastWeek = new Date(lw).toISOString();
let lm = Date.now() - 720 * 60 * 60 * 1000;
let lastMonth = new Date(lm).toISOString();

export const fetchUsers = async () => {
  try {
    const data = await db.user.findMany({});
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const CountProductsByStatus = async () => {
  const data = await db.product.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  return data;
};

export const fetchProductsByStatus = async () => {
  const products = await db.product.findMany();

  let ActiveProducts = products.filter(
    (product) => product.status === "ACTIVE"
  );
  let DraftProducts = products.filter((product) => product.status === "DRAFT");

  return { all: products, active: ActiveProducts, draft: DraftProducts };
};

export const fetchUsersByDate = async () => {
  const data = await db.user.findMany({});
  const dayCount = data.filter((d) => d.createdAt.toISOString() > lastDay);
  const weekCount = data.filter((d) => d.createdAt.toISOString() > lastWeek);
  const monthCount = data.filter((d) => d.createdAt.toISOString() > lastMonth);
  return {
    day: dayCount.length,
    week: weekCount.length,
    month: monthCount.length,
  };
};

export const fetchOrders = async () => {
  const orders = await db.order.findMany({
    include: {
      User: {
        select: {
          email: true,
        },
      },
      _count: { select: { orderItems: true } },
    },
  });

  const dayOrder = orders.filter(
    (o) => o.createdAt.toISOString() > lastDay.toString()
  );
  const weekOrder = orders.filter(
    (o) => o.createdAt.toISOString() > lastWeek.toString()
  );
  const monthOrder = orders.filter(
    (o) => o.createdAt.toISOString() > lastMonth.toString()
  );
  const fulfiedOrders = orders.filter((o) => o.status === "FULFIED");
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const canceledOrders = orders.filter((o) => o.status === "CANCELED");

  return {
    all: orders,
    day: dayOrder,
    week: weekOrder,
    month: monthOrder,
    fulfied: fulfiedOrders.length,
    pending: pendingOrders.length,
    canceled: canceledOrders.length,
  };
};

export const totalEarnings = async () => {
  const earning = await db.order.aggregate({
    where: {
      payment: { equals: "PAID" },
    },
    _sum: {
      totalAmount: true,
    },
  });
  const dayEarning = await db.order.aggregate({
    where: {
      payment: { equals: "PAID" },
      createdAt: {
        gte: lastDay,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });
  const weekEarning = await db.order.aggregate({
    where: {
      payment: { equals: "PAID" },
      createdAt: {
        gte: lastWeek,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  return { all: earning._sum, day: dayEarning._sum, week: weekEarning._sum };
};

export const fetchPayment = async () => {
  const data = await db.order.groupBy({
    by: "payment",
    _count: { id: true },
  });

  let paid = 0,
    pending = 0,
    failed = 0;
  data.map((d) => {
    if (d.payment === "PAID") {
      paid = d._count.id;
    } else if (d.payment === "PENDING") {
      pending = d._count.id;
    } else {
      failed = d._count.id;
    }
  });

  return { paid: paid, pending: pending, failed: failed };
};
