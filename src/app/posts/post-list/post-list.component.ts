import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';


// MDB Angular Pro
import { ButtonsModule, WavesModule, CardsFreeModule } from 'angular-bootstrap-md'

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css','./main.css','./mainBlogger.css']
})

export class PostListComponent implements OnInit, OnDestroy {
    [x: string]: any;
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 100;
    pageSizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    currentPage = 1;
    private postsSub: Subscription;
    userIsAuthenticated = false;

    // Authorization starts here 

    private authStatusSub: Subscription;

    constructor(public PostsService: PostsService, private authService: AuthService) {
        this.PostsService = PostsService;
    }

    ngOnInit() {
        this.isLoading = true;
        this.PostsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.PostsService.getPostUpdateListener()
            .subscribe((postsData: { posts: Post[], postCount: number }) => {
                this.isLoading = false;
                this.posts = postsData.posts;
                this.totalPosts = postsData.postCount;
            });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }
    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.PostsService.getPosts(this.postsPerPage, this.currentPage);
    }

    // onDelete (postId: string){
    //     // Fetching All with Out Pagination
    //     //this.PostsService.deletePost(postId);

    //     //with Pagination 
    //     this.isLoading = true;
    //     this.PostsService.deletePost(postId).subscribe(() =>{
    //         this.PostsService.getPosts(this.postsPerPage,this.currentPage);
    //     });
    // }

    onDelete(postId: string) {
        this.isLoading = true;

        this.PostsService.deletePost(postId).subscribe(() => {
            this.PostsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }


    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}
