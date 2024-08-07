import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { UserForm } from "../forms/user-form";

const UserDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="gap-1">
          <PlusCircle size={16} />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Customer
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full flex flex-col items-center justify-end gap-4 px-10 py-6">
        <DrawerHeader className="flex flex-col items-center justify-center gap-2">
          <DrawerTitle>Create Customer</DrawerTitle>
          <DrawerDescription>
            Enter the required details of the Customer here to add them.
          </DrawerDescription>
        </DrawerHeader>
        <UserForm />
      </DrawerContent>
    </Drawer>
  );
};

export default UserDrawer;
