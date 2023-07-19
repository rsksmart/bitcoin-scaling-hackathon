// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/*
  This library provides the schnorr signature verification to the NostrAds contract.
  We vendor it in our project because it's extremely expensive and should not be used by anyone, not even us.
  We're looking for a better solution.
  The important function here is 'verify', the rest is the usual schnorr stuff.
*/
library Schnorr {
    // Curve parameters for secp256k1
    uint256 constant N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141; // Group order
    uint256 constant A = 0x0000000000000000000000000000000000000000000000000000000000000000; // Curve coefficient 'a'
    uint256 constant B = 0x0000000000000000000000000000000000000000000000000000000000000007; // Curve coefficient 'b'
    uint256 constant Gx = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798; // x-coordinate of generator point G
    uint256 constant Gy = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8; // y-coordinate of generator point G
    uint256 constant P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f; // prime modulus for secp256k1 curve.

    function verify(
        bytes32 message,
        uint256 Px,
        uint256 Py,
        uint256 r,
        uint256 s
    ) public pure returns (bool) {
        // Ensure r and s are within the valid range
        if (r >= N || s >= N)
            return false;

        // Compute the challenge value 'e'
        uint256 e = getE(r, Px, message);

        (uint256 sGx, uint256 sGy)  = ecMul(s, Gx, Gy, A, P);
        (uint256 ePx, uint256 ePy)  = ecMul(e, Px, Py, A, P);
        (uint256 Rx, uint256 Ry) = ecAdd(sGx, sGy, ePx, ((P - ePy) % P), A, P);

        return Rx == r && (Ry % 2 == 0) && isOnCurve(Rx, Ry, A, B, P);
    }

    function getE( uint256 Rx, uint256 Px, bytes32 m) public pure returns (uint256) {
        bytes memory encoded = abi.encodePacked(Rx,Px,m);
        bytes32 tagHash = sha256(bytes("BIP0340/challenge"));
        bytes32 hash = sha256(abi.encodePacked(tagHash, tagHash, encoded));
        return uint256(hash) % N;
    }

    /// @dev Modular euclidean inverse of a number (mod p).
    /// @param _x The number
    /// @param _pp The modulus
    /// @return q such that x*q = 1 (mod _pp)
    function invMod(uint256 _x, uint256 _pp) internal pure returns (uint256) {
      require(_x != 0 && _x != _pp && _pp != 0, "Invalid number");
      uint256 q = 0;
      uint256 newT = 1;
      uint256 r = _pp;
      uint256 t;
      while (_x != 0) {
        t = r / _x;
        (q, newT) = (newT, addmod(q, (_pp - mulmod(t, newT, _pp)), _pp));
        (r, _x) = (_x, r - t * _x);
      }

      return q;
    }

    /// @dev Converts a point (x, y, z) expressed in Jacobian coordinates to affine coordinates (x', y', 1).
    /// @param _x coordinate x
    /// @param _y coordinate y
    /// @param _z coordinate z
    /// @param _pp the modulus
    /// @return (x', y') affine coordinates
    function toAffine(
      uint256 _x,
      uint256 _y,
      uint256 _z,
      uint256 _pp)
    internal pure returns (uint256, uint256)
    {
      uint256 zInv = invMod(_z, _pp);
      uint256 zInv2 = mulmod(zInv, zInv, _pp);
      uint256 x2 = mulmod(_x, zInv2, _pp);
      uint256 y2 = mulmod(_y, mulmod(zInv, zInv2, _pp), _pp);

      return (x2, y2);
    }

    /// @dev Check whether point (x,y) is on curve defined by a, b, and _pp.
    /// @param _x coordinate x of P1
    /// @param _y coordinate y of P1
    /// @param _aa constant of curve
    /// @param _bb constant of curve
    /// @param _pp the modulus
    /// @return true if x,y in the curve, false else
    function isOnCurve(
      uint _x,
      uint _y,
      uint _aa,
      uint _bb,
      uint _pp)
    internal pure returns (bool)
    {
      if (0 == _x || _x >= _pp || 0 == _y || _y >= _pp) {
        return false;
      }
      // y^2
      uint lhs = mulmod(_y, _y, _pp);
      // x^3
      uint rhs = mulmod(mulmod(_x, _x, _pp), _x, _pp);
      if (_aa != 0) {
        // x^3 + a*x
        rhs = addmod(rhs, mulmod(_x, _aa, _pp), _pp);
      }
      if (_bb != 0) {
        // x^3 + a*x + b
        rhs = addmod(rhs, _bb, _pp);
      }

      return lhs == rhs;
    }

    /// @dev Add two points (x1, y1) and (x2, y2) in affine coordinates.
    /// @param _x1 coordinate x of P1
    /// @param _y1 coordinate y of P1
    /// @param _x2 coordinate x of P2
    /// @param _y2 coordinate y of P2
    /// @param _aa constant of the curve
    /// @param _pp the modulus
    /// @return (qx, qy) = P1+P2 in affine coordinates
    function ecAdd(
      uint256 _x1,
      uint256 _y1,
      uint256 _x2,
      uint256 _y2,
      uint256 _aa,
      uint256 _pp)
      internal pure returns(uint256, uint256)
    {
      uint x = 0;
      uint y = 0;
      uint z = 0;

      // Double if x1==x2 else add
      if (_x1==_x2) {
        // y1 = -y2 mod p
        if (addmod(_y1, _y2, _pp) == 0) {
          return(0, 0);
        } else {
          // P1 = P2
          (x, y, z) = jacDouble(
            _x1,
            _y1,
            1,
            _aa,
            _pp);
        }
      } else {
        (x, y, z) = jacAdd(
          _x1,
          _y1,
          1,
          _x2,
          _y2,
          1,
          _pp);
      }
      // Get back to affine
      return toAffine(
        x,
        y,
        z,
        _pp);
    }

    /// @dev Multiply point (x1, y1, z1) times d in affine coordinates.
    /// @param _k scalar to multiply
    /// @param _x coordinate x of P1
    /// @param _y coordinate y of P1
    /// @param _aa constant of the curve
    /// @param _pp the modulus
    /// @return (qx, qy) = d*P in affine coordinates
    function ecMul(
      uint256 _k,
      uint256 _x,
      uint256 _y,
      uint256 _aa,
      uint256 _pp)
    internal pure returns(uint256, uint256)
    {
      // Jacobian multiplication
      (uint256 x1, uint256 y1, uint256 z1) = jacMul(
        _k,
        _x,
        _y,
        1,
        _aa,
        _pp);
      // Get back to affine
      return toAffine(
        x1,
        y1,
        z1,
        _pp);
    }

    /// @dev Adds two points (x1, y1, z1) and (x2 y2, z2).
    /// @param _x1 coordinate x of P1
    /// @param _y1 coordinate y of P1
    /// @param _z1 coordinate z of P1
    /// @param _x2 coordinate x of square
    /// @param _y2 coordinate y of square
    /// @param _z2 coordinate z of square
    /// @param _pp the modulus
    /// @return (qx, qy, qz) P1+square in Jacobian
    function jacAdd(
      uint256 _x1,
      uint256 _y1,
      uint256 _z1,
      uint256 _x2,
      uint256 _y2,
      uint256 _z2,
      uint256 _pp)
    internal pure returns (uint256, uint256, uint256)
    {
      if (_x1==0 && _y1==0)
        return (_x2, _y2, _z2);
      if (_x2==0 && _y2==0)
        return (_x1, _y1, _z1);

      // We follow the equations described in https://pdfs.semanticscholar.org/5c64/29952e08025a9649c2b0ba32518e9a7fb5c2.pdf Section 5
      uint[4] memory zs; // z1^2, z1^3, z2^2, z2^3
      zs[0] = mulmod(_z1, _z1, _pp);
      zs[1] = mulmod(_z1, zs[0], _pp);
      zs[2] = mulmod(_z2, _z2, _pp);
      zs[3] = mulmod(_z2, zs[2], _pp);

      // u1, s1, u2, s2
      zs = [
        mulmod(_x1, zs[2], _pp),
        mulmod(_y1, zs[3], _pp),
        mulmod(_x2, zs[0], _pp),
        mulmod(_y2, zs[1], _pp)
      ];

      // In case of zs[0] == zs[2] && zs[1] == zs[3], double function should be used
      require(zs[0] != zs[2] || zs[1] != zs[3], "Use jacDouble function instead");

      uint[4] memory hr;
      //h
      hr[0] = addmod(zs[2], _pp - zs[0], _pp);
      //r
      hr[1] = addmod(zs[3], _pp - zs[1], _pp);
      //h^2
      hr[2] = mulmod(hr[0], hr[0], _pp);
      // h^3
      hr[3] = mulmod(hr[2], hr[0], _pp);
      // qx = -h^3  -2u1h^2+r^2
      uint256 qx = addmod(mulmod(hr[1], hr[1], _pp), _pp - hr[3], _pp);
      qx = addmod(qx, _pp - mulmod(2, mulmod(zs[0], hr[2], _pp), _pp), _pp);
      // qy = -s1*z1*h^3+r(u1*h^2 -x^3)
      uint256 qy = mulmod(hr[1], addmod(mulmod(zs[0], hr[2], _pp), _pp - qx, _pp), _pp);
      qy = addmod(qy, _pp - mulmod(zs[1], hr[3], _pp), _pp);
      // qz = h*z1*z2
      uint256 qz = mulmod(hr[0], mulmod(_z1, _z2, _pp), _pp);
      return(qx, qy, qz);
    }

    /// @dev Doubles a points (x, y, z).
    /// @param _x coordinate x of P1
    /// @param _y coordinate y of P1
    /// @param _z coordinate z of P1
    /// @param _aa the a scalar in the curve equation
    /// @param _pp the modulus
    /// @return (qx, qy, qz) 2P in Jacobian
    function jacDouble(
      uint256 _x,
      uint256 _y,
      uint256 _z,
      uint256 _aa,
      uint256 _pp)
    internal pure returns (uint256, uint256, uint256)
    {
      if (_z == 0)
        return (_x, _y, _z);

      // We follow the equations described in https://pdfs.semanticscholar.org/5c64/29952e08025a9649c2b0ba32518e9a7fb5c2.pdf Section 5
      // Note: there is a bug in the paper regarding the m parameter, M=3*(x1^2)+a*(z1^4)
      // x, y, z at this point represent the squares of _x, _y, _z
      uint256 x = mulmod(_x, _x, _pp); //x1^2
      uint256 y = mulmod(_y, _y, _pp); //y1^2
      uint256 z = mulmod(_z, _z, _pp); //z1^2

      // s
      uint s = mulmod(4, mulmod(_x, y, _pp), _pp);
      // m
      uint m = addmod(mulmod(3, x, _pp), mulmod(_aa, mulmod(z, z, _pp), _pp), _pp);

      // x, y, z at this point will be reassigned and rather represent qx, qy, qz from the paper
      // This allows to reduce the gas cost and stack footprint of the algorithm
      // qx
      x = addmod(mulmod(m, m, _pp), _pp - addmod(s, s, _pp), _pp);
      // qy = -8*y1^4 + M(S-T)
      y = addmod(mulmod(m, addmod(s, _pp - x, _pp), _pp), _pp - mulmod(8, mulmod(y, y, _pp), _pp), _pp);
      // qz = 2*y1*z1
      z = mulmod(2, mulmod(_y, _z, _pp), _pp);

      return (x, y, z);
    }

    /// @dev Multiply point (x, y, z) times d.
    /// @param _d scalar to multiply
    /// @param _x coordinate x of P1
    /// @param _y coordinate y of P1
    /// @param _z coordinate z of P1
    /// @param _aa constant of curve
    /// @param _pp the modulus
    /// @return (qx, qy, qz) d*P1 in Jacobian
    function jacMul(
      uint256 _d,
      uint256 _x,
      uint256 _y,
      uint256 _z,
      uint256 _aa,
      uint256 _pp)
    internal pure returns (uint256, uint256, uint256)
    {
      // Early return in case that `_d == 0`
      if (_d == 0) {
        return (_x, _y, _z);
      }

      uint256 remaining = _d;
      uint256 qx = 0;
      uint256 qy = 0;
      uint256 qz = 1;

      // Double and add algorithm
      while (remaining != 0) {
        if ((remaining & 1) != 0) {
          (qx, qy, qz) = jacAdd(
            qx,
            qy,
            qz,
            _x,
            _y,
            _z,
            _pp);
        }
        remaining = remaining / 2;
        (_x, _y, _z) = jacDouble(
          _x,
          _y,
          _z,
          _aa,
          _pp);
      }
      return (qx, qy, qz);
    }
}
