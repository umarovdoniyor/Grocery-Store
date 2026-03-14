import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
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
      memberProperties
      memberRank
      memberArticles
      memberPoints
      memberLikes
      memberViews
      memberWarnings
      memberBlocks
      deletedAt
      createdAt
      updatedAt
      accessToken
    }
  }
`;

export const UPDATE_MEMBER_STATUS_BY_ADMIN = gql`
  mutation UpdateMemberStatusByAdmin($input: UpdateMemberStatusByAdminInput!) {
    updateMemberStatusByAdmin(input: $input) {
      _id
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
  }
`;

/**************************
 *        PROPERTY        *
 *************************/

export const UPDATE_PROPERTY_BY_ADMIN = gql`
  mutation UpdatePropertyByAdmin($input: PropertyUpdate!) {
    updatePropertyByAdmin(input: $input) {
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
    }
  }
`;

export const REMOVE_PROPERTY_BY_ADMIN = gql`
  mutation RemovePropertyByAdmin($input: String!) {
    removePropertyByAdmin(propertyId: $input) {
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
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
    updateBoardArticleByAdmin(input: $input) {
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
    }
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticleByAdmin($input: String!) {
    removeBoardArticleByAdmin(articleId: $input) {
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
    }
  }
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *        CATEGORY        *
 *************************/

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
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
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
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
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation RemoveCategory($input: RemoveCategoryInput!) {
    removeCategory(input: $input) {
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
  }
`;

export const UPDATE_PRODUCT_STATUS_BY_ADMIN = gql`
  mutation UpdateProductStatusByAdmin($input: UpdateProductStatusByAdminInput!) {
    updateProductStatusByAdmin(input: $input) {
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

export const REMOVE_PRODUCT_BY_ADMIN = gql`
  mutation RemoveProductByAdmin($input: RemoveProductInput!) {
    removeProductByAdmin(input: $input) {
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

export const SET_PRODUCT_FEATURED_BY_ADMIN = gql`
  mutation SetProductFeaturedByAdmin($input: SetProductFeaturedByAdminInput!) {
    setProductFeaturedByAdmin(input: $input) {
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
  }
`;

export const UPDATE_ORDER_STATUS_BY_ADMIN = gql`
  mutation UpdateOrderStatusByAdmin($input: UpdateOrderStatusByAdminInput!) {
    updateOrderStatusByAdmin(input: $input) {
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

export const CANCEL_ORDER_BY_ADMIN = gql`
  mutation CancelOrderByAdmin($input: CancelOrderByAdminInput!) {
    cancelOrderByAdmin(input: $input) {
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
