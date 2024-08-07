"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DrawerClose } from "../ui/drawer";
import { userSchema } from "@/lib/formSchemas";
import { Textarea } from "../ui/textarea";
import ImageUploader from "../image-uploader";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/db/actions";

export function UserForm() {
  const queryClient = useQueryClient();
  const [imgUrl, setImgUrl] = useState<string[]>([]);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      address: "",
      email: "",
      modile: "",
      name: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created");
    },
    onError: ({ message }) => toast.error(message),
  });

  function onSubmit(data: z.infer<typeof userSchema>) {
    mutate({
      name: data.name,
      email: data.email,
      address: data.address,
      mobile: data.modile,
      avatarUrl: imgUrl[0],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[70%] py-4">
        <div className="grid grid-cols-3 border-2 rounded-lg gap-2 p-2">
          <ImageUploader imgUrl={imgUrl} setImgUrl={setImgUrl} type="user" />
          <div className="grid grid-cols-1 gap-2 col-span-2 border-2 rounded-lg p-4 border-dashed">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modile</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="modile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full gap-4 items-center justify-center mt-4">
              <DrawerClose asChild>
                <Button type="submit" size="lg" className="w-full">
                  Submit
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline" size="lg" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
