import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberWarnings
        memberBlocks
        memberProperties
        memberRank
        memberArticles
        memberPoints
        memberLikes
        memberViews
        deletedAt
        createdAt
        updatedAt
        accessToken
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBERS_BY_ADMIN = gql`
  query GetMembersByAdmin($input: MembersInquiryByAdminInput!) {
    getMembersByAdmin(input: $input) {
      list {
        _id
        ordersCount
        memberEmail
        memberPhone
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
        memberType
        memberStatus
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *        PROPERTY        *
 *************************/

export const GET_ALL_PROPERTIES_BY_ADMIN = gql`
  query GetAllPropertiesByAdmin($input: AllPropertiesInquiry!) {
    getAllPropertiesByAdmin(input: $input) {
      list {
        _id
        propertyType
        propertyStatus
        propertyLocation
        propertyAddress
        propertyTitle
        propertyPrice
        propertySquare
        propertyBeds
        propertyRooms
        propertyViews
        propertyLikes
        propertyImages
        propertyDesc
        propertyBarter
        propertyRent
        memberId
        soldAt
        deletedAt
        constructedAt
        createdAt
        updatedAt
        memberData {
          _id
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberWarnings
          memberBlocks
          memberProperties
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        memberId
        createdAt
        updatedAt
        memberData {
          _id
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberWarnings
          memberBlocks
          memberProperties
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
          _id
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberWarnings
          memberBlocks
          memberProperties
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *        CATEGORY        *
 *************************/

export const GET_CATEGORIES_BY_ADMIN = gql`
  query GetCategoriesByAdmin($input: CategoryInquiry!) {
    getCategoriesByAdmin(input: $input) {
      list {
        _id
        name
        slug
        description
        icon
        image
        status
        sortOrder
        parentId
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PRODUCTS_BY_ADMIN = gql`
  query GetProductsByAdmin($input: AdminProductsInquiry) {
    getProductsByAdmin(input: $input) {
      list {
        _id
        memberId
        title
        description
        categoryIds
        brand
        sku
        unit
        price
        salePrice
        stockQty
        minOrderQty
        tags
        images
        thumbnail
        status
        views
        likes
        ordersCount
        isFeatured
        featuredRank
        featuredAt
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS_BY_ADMIN = gql`
  query GetFeaturedProductsByAdmin($input: AdminProductsInquiry) {
    getFeaturedProductsByAdmin(input: $input) {
      list {
        _id
        memberId
        title
        description
        categoryIds
        brand
        sku
        unit
        price
        salePrice
        stockQty
        minOrderQty
        tags
        images
        thumbnail
        status
        views
        likes
        ordersCount
        isFeatured
        featuredRank
        featuredAt
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID_BY_ADMIN = gql`
  query GetProductByIdByAdmin($productId: String!) {
    getProductByIdByAdmin(productId: $productId) {
      _id
      memberId
      title
      description
      categoryIds
      brand
      sku
      unit
      price
      salePrice
      stockQty
      minOrderQty
      tags
      images
      thumbnail
      status
      views
      likes
      ordersCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_VENDOR_APPLICATIONS_BY_ADMIN = gql`
  query GetVendorApplicationsByAdmin($input: VendorApplicationsInquiryInput!) {
    getVendorApplicationsByAdmin(input: $input) {
      list {
        _id
        memberId
        storeName
        description
        businessLicenseUrl
        status
        rejectionReason
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ORDERS_BY_ADMIN = gql`
  query GetOrdersByAdmin($input: AdminOrdersInquiryInput!) {
    getOrdersByAdmin(input: $input) {
      list {
        _id
        orderNo
        memberId
        status
        paymentMethod
        paymentStatus
        subtotal
        discountAmount
        deliveryFee
        taxAmount
        totalAmount
        currency
        addressFullName
        addressPhone
        addressLine1
        addressLine2
        addressCity
        addressState
        addressPostalCode
        addressCountry
        note
        placedAt
        canceledAt
        deliveredAt
        createdAt
        updatedAt
        items {
          _id
          orderId
          productId
          vendorId
          quantity
          unitPrice
          salePrice
          appliedPrice
          lineTotal
          productSnapshotTitle
          productSnapshotThumbnail
          productSnapshotUnit
          productSnapshotSku
          createdAt
          updatedAt
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ORDER_BY_ID_BY_ADMIN = gql`
  query GetOrderByIdByAdmin($orderId: String!) {
    getOrderByIdByAdmin(orderId: $orderId) {
      _id
      orderNo
      memberId
      status
      paymentMethod
      paymentStatus
      subtotal
      discountAmount
      deliveryFee
      taxAmount
      totalAmount
      currency
      addressFullName
      addressPhone
      addressLine1
      addressLine2
      addressCity
      addressState
      addressPostalCode
      addressCountry
      note
      placedAt
      canceledAt
      deliveredAt
      createdAt
      updatedAt
      items {
        _id
        orderId
        productId
        vendorId
        quantity
        unitPrice
        salePrice
        appliedPrice
        lineTotal
        productSnapshotTitle
        productSnapshotThumbnail
        productSnapshotUnit
        productSnapshotSku
        createdAt
        updatedAt
      }
    }
  }
`;
