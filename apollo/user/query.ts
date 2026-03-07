import { gql } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

export const ME = gql`
  query Me {
    me {
      _id
      memberEmail
      memberPhone
      memberNickname
      memberFirstName
      memberLastName
      memberAvatar
      memberAddress
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

export const GET_MEMBER_PROFILE = gql`
  query GetMemberProfile($memberId: String!) {
    getMemberProfile(memberId: $memberId) {
      _id
      memberEmail
      memberPhone
      memberNickname
      memberFirstName
      memberLastName
      memberAvatar
      memberAddress
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

export const GET_MY_VENDOR_APPLICATION = gql`
  query GetMyVendorApplication {
    getMyVendorApplication {
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

export const GET_MY_PRODUCTS = gql`
  query GetMyProducts($input: MyProductsInquiry) {
    getMyProducts(input: $input) {
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
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($input: CatalogProductsInquiry!) {
    getProducts(input: $input) {
      list {
        _id
        title
        slug
        thumbnail
        ratingAvg
        reviewsCount
        price
        salePrice
        stockQty
        status
        likes
        views
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($productId: String!) {
    getProductById(productId: $productId) {
      _id
      memberId
      title
      slug
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
      meLiked
      meViewed
      createdAt
      updatedAt
      vendor {
        _id
        memberNickname
        memberFirstName
        memberLastName
        memberAvatar
        memberType
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($input: FeaturedProductsInquiry!) {
    getFeaturedProducts(input: $input) {
      _id
      title
      slug
      thumbnail
      price
      salePrice
      stockQty
      status
      likes
      views
      createdAt
    }
  }
`;

export const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($input: RelatedProductsInquiry!) {
    getRelatedProducts(input: $input) {
      _id
      title
      slug
      thumbnail
      price
      salePrice
      stockQty
      status
      likes
      views
      createdAt
    }
  }
`;

export const SEARCH_SUGGESTIONS = gql`
  query SearchSuggestions($input: SearchSuggestionsInput!) {
    searchSuggestions(input: $input) {
      _id
      title
      slug
      thumbnail
    }
  }
`;

export const GET_MY_CART = gql`
  query GetMyCart {
    getMyCart {
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

export const GET_CHECKOUT_SUMMARY = gql`
  query GetCheckoutSummary {
    getCheckoutSummary {
      subtotal
      discountAmount
      deliveryFee
      taxAmount
      totalAmount
      currency
    }
  }
`;

export const GET_MY_WISHLIST = gql`
  query GetMyWishlist($input: GetMyWishlistInput!) {
    getMyWishlist(input: $input) {
      list {
        _id
        memberId
        productId
        createdAt
        product {
          _id
          slug
          title
          thumbnail
          price
          salePrice
          status
        }
      }
      metaCounter {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_WISHLIST_STATUS = gql`
  query GetWishlistStatus($input: GetWishlistStatusInput!) {
    getWishlistStatus(input: $input) {
      list {
        productId
        isWishlisted
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders($input: GetMyOrdersInput!) {
    getMyOrders(input: $input) {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MY_ORDER_BY_ID = gql`
  query GetMyOrderById($orderId: String!) {
    getMyOrderById(orderId: $orderId) {
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

export const GET_CATEGORIES = gql`
  query GetCategories($input: CategoryInquiry) {
    getCategories(input: $input) {
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

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($categoryId: String!) {
    getCategoryById(categoryId: $categoryId) {
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

export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    getCategoryBySlug(slug: $slug) {
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

export const GET_VENDORS = gql`
  query GetVendors($input: VendorsInquiry!) {
    getVendors(input: $input) {
      list {
        _id
        slug
        storeName
        memberPhone
        memberAddress
        memberImage
        coverImage
        verified
        status
        productsCount
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_VENDOR_BY_SLUG = gql`
  query GetVendorBySlug($slug: String!) {
    getVendorBySlug(slug: $slug) {
      _id
      slug
      storeName
      memberPhone
      memberAddress
      memberImage
      coverImage
      verified
      status
      productsCount
      createdAt
      updatedAt
      storeDescription
      memberEmail
    }
  }
`;

export const GET_VENDOR_PRODUCTS = gql`
  query GetVendorProducts($vendorId: String!, $input: VendorProductsInquiry!) {
    getVendorProducts(vendorId: $vendorId, input: $input) {
      list {
        _id
        title
        slug
        thumbnail
        price
        salePrice
        stockQty
        status
        likes
        views
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($input: ProductReviewsInquiry!) {
    getProductReviews(input: $input) {
      list {
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
      metaCounter {
        total
      }
      summary {
        ratingAvg
        reviewsCount
        rating1Count
        rating2Count
        rating3Count
        rating4Count
        rating5Count
      }
    }
  }
`;

export const GET_MY_PRODUCT_REVIEW = gql`
  query GetMyProductReview($productId: String!) {
    getMyProductReview(productId: $productId) {
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

export const GET_REVIEWS_BY_ADMIN = gql`
  query GetReviewsByAdmin($input: ReviewsByAdminInquiry!) {
    getReviewsByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
      summary {
        ratingAvg
        reviewsCount
        rating1Count
        rating2Count
        rating3Count
        rating4Count
        rating5Count
      }
    }
  }
`;

export const GET_AGENTS = gql`
  query GetAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
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
        memberPoints
        memberLikes
        memberViews
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *        PROPERTY        *
 *************************/

export const GET_PROPERTY = gql`
  query GetProperty($input: String!) {
    getProperty(propertyId: $input) {
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
        memberPoints
        memberLikes
        memberViews
        deletedAt
        createdAt
        updatedAt
        accessToken
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_PROPERTIES = gql`
  query GetProperties($input: PropertiesInquiry!) {
    getProperties(input: $input) {
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
        propertyRank
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
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_AGENT_PROPERTIES = gql`
  query GetAgentProperties($input: AgentPropertiesInquiry!) {
    getAgentProperties(input: $input) {
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
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($input: OrdinaryInquiry!) {
    getFavorites(input: $input) {
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
        propertyComments
        propertyRank
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
          memberProperties
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
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

export const GET_VISITED = gql`
  query GetVisited($input: OrdinaryInquiry!) {
    getVisited(input: $input) {
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
        propertyComments
        propertyRank
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
          memberProperties
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
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

export const GET_BOARD_ARTICLE = gql`
  query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
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
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

export const GET_BOARD_ARTICLES = gql`
  query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
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
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
  query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
        followerData {
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
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
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

export const GET_MEMBER_FOLLOWINGS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        followingData {
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
          memberArticles
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberFollowings
          memberFollowers
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
          accessToken
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
