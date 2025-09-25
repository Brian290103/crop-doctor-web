"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import AddSourcesTab from "./add-sources-tab"
import SourcesTab from "./sources-tab"

const SourcesClientPage = () => {
  return (
    <Tabs defaultValue="sources">
      <TabsList>
        <TabsTrigger value="sources">Sources</TabsTrigger>
        <TabsTrigger value="add-sources">Add Sources</TabsTrigger>
      </TabsList>
      <TabsContent value="sources">
        <SourcesTab />
      </TabsContent>
      <TabsContent value="add-sources">
        <AddSourcesTab />
      </TabsContent>
    </Tabs>
  )
}

export default SourcesClientPage
