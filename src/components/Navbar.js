import React from "react";
import { Box, Flex, Button } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box overflowX="hidden">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="nowrap"
        w="100%"
        py={14}
        px={18}
        color="black"
        backdropFilter="blur(10px)"
        zIndex={1}
        bg="#FFFFFF"
      >
        <Flex alignItems="center">
          <Box
            w={46}
            h={46}
            borderRadius="50%"
            backgroundColor="#ccc"
            marginBottom={10}
            flexShrink={0}
          />
          <Box as="span" fontSize="xl" fontWeight="bold" ml={4}>
            OrdinalDAO
          </Box>
        </Flex>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          flexBasis={{ base: "100%", md: "auto" }}
        >
            <Button
              display="inline-flex"
              padding="15px 20px"
              alignItems="center"
              gap={10}
              borderRadius={5}
              border="2px solid #000"
              background="#FEC34A"
              cursor="pointer"
              mr={25}
            >
              Connect Ordinal
            </Button>

            <Button
              display="inline-flex"
              padding="15px 20px"
              alignItems="center"
              gap={10}
              borderRadius={5}
              border="2px solid #000"
              cursor="pointer"
              background="#FEC34A"
            >
              Connect rBTC
            </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
