"use server";

import { Product, ProductStatus } from "@prisma/client";
import { db } from ".";
import { optionProps, variantProps } from "@/components/forms/product-form";

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
    return error;
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

export const fetchActiveProducts = async () => {
  const active = await db.product.findMany({
    where: { status: { equals: "ACTIVE" } },
  });

  const latestActive = active.filter(
    (p) => p.createdAt.toISOString() > lastDay
  );
  return { active: active.length, latest: latestActive.length };
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
          name: true,
          avatarUrl: true,
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

  return {
    all: earning._sum.totalAmount,
    day: dayEarning._sum.totalAmount,
    week: weekEarning._sum.totalAmount,
  };
};

export const monthlyIncome = async () => {
  const monthly = await db.order.groupBy({
    by: "createdAt",
    where: {
      payment: "PAID",
    },
    _sum: { totalAmount: true },
  });
  let m: Array<{ month: string; amount: number }> = [];
  monthly.map((mon) =>
    m.push({
      month: mon.createdAt.toLocaleString("default", { month: "long" }),
      amount: mon._sum.totalAmount || 0,
    })
  );

  let chartData: any = {};

  m.map((data) => {
    if (data.month! in chartData) {
      chartData[data.month] += data.amount;
    } else {
      chartData[data.month] = data.amount;
    }
  });

  m = [];

  for (var i in chartData) {
    m.push({ month: i, amount: chartData[i] });
  }

  return m;
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

export const recentTransactions = async () => {
  const data = await db.order.findMany({
    where: {
      payment: "PAID",
      createdAt: {
        gt: lastDay,
      },
    },
    select: {
      User: { select: { avatarUrl: true, name: true, email: true } },
      totalAmount: true,
    },
    take: 5,
  });
  return data;
};

export const createUser = async ({
  email,
  mobile,
  name,
  address,
  avatarUrl,
}: {
  email: string;
  mobile: string;
  name: string;
  address: string;
  avatarUrl: string;
}) => {
  const existing = await db.user.findFirst({
    where: { email },
  });
  if (existing) {
    throw new Error("User Already exists");
  }

  await db.user.create({
    data: {
      name,
      email,
      address,
      avatarUrl,
      mobile,
    },
  });
  return { success: true };
};

export const deleteUser = async ({ userId }: { userId: string }) => {
  try {
    await db.user.delete({
      where: { id: userId },
    });
    return { success: true };
  } catch (error) {
    return error;
  }
};

export const deleteOrder = async ({ orderId }: { orderId: string }) => {
  try {
    await db.order.delete({
      where: { id: orderId },
    });
    return { success: true };
  } catch (error) {
    return error;
  }
};

export const createProduct = async ({
  title,
  comparePrice,
  description,
  inventory,
  media,
  price,
  status,
  options,
  variant,
}: {
  title: string;
  comparePrice: string;
  description: string;
  inventory: string;
  media: string[];
  price: string;
  status: string;
  variant: variantProps[];
  options: optionProps[];
}) => {
  try {
    const product = await db.product.create({
      data: {
        title,
        description,
        comparePrice: Number(comparePrice),
        price: Number(price),
        media,
        status: status as ProductStatus,
        inventory: Number(inventory),
      },
    });
    if (variant.length !== 0 && options.length !== 0) {
      variant.map(async (vari) => {
        await db.variant.create({
          data: {
            name: vari.name,
            options: vari.options,
            productId: product.id,
          },
        });
      });
      options.map(async (opt) => {
        await db.variantOptions.create({
          data: {
            option: opt.option,
            price: Number(opt.price),
            inventory: Number(opt.inventory),
            productId: product.id,
          },
        });
      });
      return { success: true };
    }
    return { success: true };
  } catch (error) {
    return error;
  }
};

export const fetchProduct = async ({ productId }: { productId: string }) => {
  const data = await db.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      Variant: { select: { name: true, options: true } },
      variantOptions: {
        select: { option: true, price: true, inventory: true },
      },
    },
  });
  return data;
};

export const updateProduct = async ({
  product,
  options,
  variant,
}: {
  product: {
    id: string;
    title: string;
    comparePrice: number;
    description: string;
    inventory: number;
    media: string[];
    price: number;
    status: ProductStatus;
  };
  variant: variantProps[];
  options: optionProps[];
}) => {
  await db.product.update({
    where: { id: product.id },
    data: { ...product },
  });

  if (variant.length !== 0 && options.length !== 0) {
    await db.variant.deleteMany({ where: { productId: product.id } });
    await db.variantOptions.deleteMany({ where: { productId: product.id } });
    variant.map(async (vari) => {
      await db.variant.create({
        data: {
          name: vari.name,
          options: vari.options,
          productId: product.id,
        },
      });
    });
    options.map(async (opt) => {
      await db.variantOptions.create({
        data: {
          option: opt.option,
          price: Number(opt.price),
          inventory: Number(opt.inventory),
          productId: product.id,
        },
      });
    });
    return { success: true };
  }
  return { success: true };
};

export const changeStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  try {
    await db.product.update({
      where: { id },
      data: { status: status as ProductStatus },
    });
    return { success: true };
  } catch (error) {
    return error;
  }
};

export const deleteProduct = async ({ productId }: { productId: string }) => {
  try {
    await db.product.delete({
      where: { id: productId },
    });
    return { success: true };
  } catch (error) {
    return error;
  }
};
