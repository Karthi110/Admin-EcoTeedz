import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import {
  optionProps,
  ProductForm,
  variantProps,
} from "@/components/forms/product-form";
import { fetchProduct } from "@/db/actions";
import { db } from "@/db";
import { string } from "zod";
import { Variant, VariantOptions } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: {
    productId: string;
  };
}

interface productProps {
  id: string;
  title: string;
  description: string;
  media: string[];
  status: string;
  comparePrice: number | null;
  price: number;
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
  Variant: variantProps[] | null;
  variantOptions: optionProps[] | null;
}
const ProductIdPage = async ({ params }: Props) => {
  const productId = params.productId;
  let product: productProps | null;

  if (productId !== "new") {
    product = await fetchProduct({ productId });
    if (!product) {
      redirect("/products");
    }
  } else {
    product = null;
  }

  return (
    <div>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {productId === "new" ? (
                <BreadcrumbPage>New Product</BreadcrumbPage>
              ) : (
                <BreadcrumbPage>Edit Product</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </header>
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-6 mt-3">
        <div className="grid flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
              <Link href="/products">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Product Controller
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save Product</Button>
          </div>

          {product ? (
            <ProductForm
              product={{
                id: product?.id!,
                comparePrice: product?.comparePrice,
                description: product?.description,
                inventory: product?.inventory,
                media: product?.media,
                price: product?.price,
                status: product?.status,
                title: product?.title,
              }}
              variants={product.Variant || []}
              variantOptions={product.variantOptions || []}
            />
          ) : (
            <ProductForm variants={[]} variantOptions={[]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductIdPage;
