import Sidebar from "@/components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={4}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle disabled />
      <ResizablePanel
        className="border-2 rounded-md px-4 py-10 bg-muted/40"
        defaultSize={96}
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default layout;
