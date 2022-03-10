import React from "react";
import {Heading, HeadingProps, BoxProps, Box} from "@chakra-ui/react";

type P = HeadingProps;
export const H1: React.FC<P> = p => <Heading as="h1" size="xl" mt={0} {...p} />
export const H2: React.FC<P> = p => <Heading as="h2" size="lg" {...p} />
export const H3: React.FC<P> = p => <Heading as="h3" size="md" {...p} />
export const H4: React.FC<P> = p => <Heading as="h4" size="sm" {...p} />
export const H5: React.FC<P> = p => <Heading as="h5" size="xs" {...p} />
export const H6: React.FC<P> = p => <Heading as="h6" size="2xs" {...p} />
export const RounderBox: React.FC<BoxProps> = p => <Box borderRadius="8px" backgroundColor="white" {...p} />
