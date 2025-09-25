'use client';

import { CreateSourceForm } from "@/components/create-source-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AddSourcesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Source</CardTitle>
        <CardDescription>Fill in the details to add a new source.</CardDescription>
      </CardHeader>
      <CardContent>
        <CreateSourceForm />
      </CardContent>
    </Card>
  );
};

export default AddSourcesTab;
