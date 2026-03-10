import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
  mutation SignUp($input: MemberSignUpInput!) {
    signUp(input: $input) {
      accessToken
      member {
        _id
        memberEmail
        memberPhone
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
        memberAddress
        memberDob
        memberType
        memberStatus
        isEmailVerified
        isPhoneVerified
        lastLoginAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGIN = gql`
  mutation LogIn($input: MemberLoginInput!) {
    logIn(input: $input) {
      accessToken
      member {
        _id
        memberEmail
        memberPhone
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
        memberAddress
        memberDob
        memberType
        memberStatus
        isEmailVerified
        isPhoneVerified
        lastLoginAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
      _id
      memberEmail
      memberPhone
      memberNickname
      memberFirstName
      memberLastName
      memberAvatar
      memberAddress
      memberDob
      memberType
      memberStatus
      isEmailVerified
      isPhoneVerified
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

export const CHANGE_MEMBER_PASSWORD = gql`
  mutation ChangeMemberPassword($input: ChangeMemberPasswordInput!) {
    changeMemberPassword(input: $input) {
      _id
      memberEmail
      memberPhone
      memberNickname
      memberFirstName
      memberLastName
      memberAvatar
      memberAddress
      memberDob
      memberType
      memberStatus
      isEmailVerified
      isPhoneVerified
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

export const APPLY_VENDOR = gql`
  mutation ApplyVendor($input: ApplyVendorInput!) {
    applyVendor(input: $input) {
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
  }
`;

export const REVIEW_VENDOR_APPLICATION = gql`
  mutation ReviewVendorApplication($input: ReviewVendorApplicationInput!) {
    reviewVendorApplication(input: $input) {
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
  }
`;

export const UPDATE_MY_VENDOR_PROFILE = gql`
  mutation UpdateMyVendorProfile($input: UpdateMyVendorProfileInput!) {
    updateMyVendorProfile(input: $input) {
      _id
      memberId
      storeName
      storeDescription
      coverImageUrl
      category
      minimumOrderQty
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MY_VENDOR_ORDER_ITEM_STATUS = gql`
  mutation UpdateMyVendorOrderItemStatus($input: UpdateMyVendorOrderItemStatusInput!) {
    updateMyVendorOrderItemStatus(input: $input) {
      orderId
      itemId
      status
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
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

export const REMOVE_PRODUCT = gql`
  mutation RemoveProduct($input: RemoveProductInput!) {
    removeProduct(input: $input) {
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

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($input: ToggleLikeInput!) {
    toggleLike(input: $input) {
      likeGroup
      likeRefId
      liked
      totalLikes
    }
  }
`;

export const RECORD_VIEW = gql`
  mutation RecordView($input: RecordViewInput!) {
    recordView(input: $input) {
      viewGroup
      viewRefId
      viewed
      totalViews
    }
  }
`;

export const CREATE_PRODUCT_REVIEW = gql`
  mutation CreateProductReview($input: CreateProductReviewInput!) {
    createProductReview(input: $input) {
      _id
      productId
      memberId
      orderId
      rating
      comment
      images
      status
      moderationReason
      moderatedBy
      moderatedAt
      createdAt
      updatedAt
      member {
        _id
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
      }
    }
  }
`;

export const UPDATE_PRODUCT_REVIEW = gql`
  mutation UpdateProductReview($input: UpdateProductReviewInput!) {
    updateProductReview(input: $input) {
      _id
      productId
      memberId
      orderId
      rating
      comment
      images
      status
      moderationReason
      moderatedBy
      moderatedAt
      createdAt
      updatedAt
      member {
        _id
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
      }
    }
  }
`;

export const REMOVE_PRODUCT_REVIEW = gql`
  mutation RemoveProductReview($reviewId: String!) {
    removeProductReview(reviewId: $reviewId)
  }
`;

export const UPDATE_REVIEW_STATUS_BY_ADMIN = gql`
  mutation UpdateReviewStatusByAdmin($input: UpdateReviewStatusByAdminInput!) {
    updateReviewStatusByAdmin(input: $input) {
      _id
      productId
      memberId
      orderId
      rating
      comment
      images
      status
      moderationReason
      moderatedBy
      moderatedAt
      createdAt
      updatedAt
      member {
        _id
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
      }
    }
  }
`;

export const IMAGE_UPLOADER = gql`
  mutation ImageUploader($file: Upload!, $target: String!) {
    imageUploader(file: $file, target: $target)
  }
`;

export const IMAGES_UPLOADER = gql`
  mutation ImagesUploader($files: [Upload!]!, $target: String!) {
    imagesUploader(files: $files, target: $target)
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      _id
      memberId
      items {
        _id
        cartId
        memberId
        productId
        vendorId
        quantity
        unitPrice
        salePrice
        appliedPrice
        lineTotal
        status
        productSnapshotTitle
        productSnapshotThumbnail
        productSnapshotUnit
        createdAt
        updatedAt
      }
      itemsCount
      subtotal
      discountAmount
      deliveryFee
      taxAmount
      totalAmount
      currency
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CART_ITEM_QTY = gql`
  mutation UpdateCartItemQty($input: UpdateCartItemQtyInput!) {
    updateCartItemQty(input: $input) {
      _id
      memberId
      items {
        _id
        cartId
        memberId
        productId
        vendorId
        quantity
        unitPrice
        salePrice
        appliedPrice
        lineTotal
        status
        productSnapshotTitle
        productSnapshotThumbnail
        productSnapshotUnit
        createdAt
        updatedAt
      }
      itemsCount
      subtotal
      discountAmount
      deliveryFee
      taxAmount
      totalAmount
      currency
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($input: RemoveCartItemInput!) {
    removeCartItem(input: $input) {
      _id
      memberId
      items {
        _id
        cartId
        memberId
        productId
        vendorId
        quantity
        unitPrice
        salePrice
        appliedPrice
        lineTotal
        status
        productSnapshotTitle
        productSnapshotThumbnail
        productSnapshotUnit
        createdAt
        updatedAt
      }
      itemsCount
      subtotal
      discountAmount
      deliveryFee
      taxAmount
      totalAmount
      currency
      createdAt
      updatedAt
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      _id
      memberId
      items {
        _id
        cartId
        memberId
        productId
        vendorId
        quantity
        unitPrice
        salePrice
        appliedPrice
        lineTotal
        status
        productSnapshotTitle
        productSnapshotThumbnail
        productSnapshotUnit
        createdAt
        updatedAt
      }
      itemsCount
      subtotal
      discountAmount
      deliveryFee
      taxAmount
      totalAmount
      currency
      createdAt
      updatedAt
    }
  }
`;

export const VALIDATE_CART_FOR_CHECKOUT = gql`
  mutation ValidateCartForCheckout {
    validateCartForCheckout {
      isValid
      issues {
        code
        message
        productId
        requestedQty
        availableQty
      }
      summary {
        subtotal
        discountAmount
        deliveryFee
        taxAmount
        totalAmount
        currency
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($input: AddToWishlistInput!) {
    addToWishlist(input: $input) {
      success
      message
      wishlistItem {
        _id
        memberId
        productId
        createdAt
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($input: RemoveFromWishlistInput!) {
    removeFromWishlist(input: $input) {
      success
      message
      removedProductId
    }
  }
`;

export const CREATE_ORDER_FROM_CART = gql`
  mutation CreateOrderFromCart($input: CreateOrderFromCartInput!) {
    createOrderFromCart(input: $input) {
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
      items {
        _id
        orderId
        memberId
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
      createdAt
      updatedAt
    }
  }
`;

export const CANCEL_MY_ORDER = gql`
  mutation CancelMyOrder($input: CancelMyOrderInput!) {
    cancelMyOrder(input: $input) {
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
      items {
        _id
        orderId
        memberId
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
      createdAt
      updatedAt
    }
  }
`;

export const LIKE_TARGET_MEMBER = gql`
  mutation LikeTargetMember($input: String!) {
    likeTargetMember(memberId: $input) {
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
`;

/**************************
 *        PROPERTY        *
 *************************/

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
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

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($input: PropertyUpdate!) {
    updateProperty(input: $input) {
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

export const LIKE_TARGET_PROPERTY = gql`
  mutation LikeTargetProperty($input: String!) {
    likeTargetProperty(propertyId: $input) {
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

export const CREATE_BOARD_ARTICLE = gql`
  mutation CreateBoardArticle($input: BoardArticleInput!) {
    createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
  mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
    updateBoardArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
  mutation LikeTargetBoardArticle($input: String!) {
    likeTargetBoardArticle(articleId: $input) {
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

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
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
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
  mutation Subscribe($input: String!) {
    subscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($input: String!) {
    unsubscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;
