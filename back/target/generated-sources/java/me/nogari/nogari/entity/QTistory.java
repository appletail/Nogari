package me.nogari.nogari.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTistory is a Querydsl query type for Tistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTistory extends EntityPathBase<Tistory> {

    private static final long serialVersionUID = -378526325L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTistory tistory = new QTistory("tistory");

    public final QBaseTimeEntity _super = new QBaseTimeEntity(this);

    public final StringPath blogName = createString("blogName");

    public final StringPath categoryName = createString("categoryName");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    public final QMember member;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final NumberPath<Long> postId = createNumber("postId", Long.class);

    public final StringPath requestLink = createString("requestLink");

    public final StringPath responseLink = createString("responseLink");

    public final StringPath status = createString("status");

    public final StringPath tagList = createString("tagList");

    public final NumberPath<Long> tistoryId = createNumber("tistoryId", Long.class);

    public final StringPath title = createString("title");

    public final NumberPath<Byte> visibility = createNumber("visibility", Byte.class);

    public QTistory(String variable) {
        this(Tistory.class, forVariable(variable), INITS);
    }

    public QTistory(Path<? extends Tistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTistory(PathMetadata metadata, PathInits inits) {
        this(Tistory.class, metadata, inits);
    }

    public QTistory(Class<? extends Tistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member"), inits.get("member")) : null;
    }

}

